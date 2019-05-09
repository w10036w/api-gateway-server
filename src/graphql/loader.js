import Dataloader from 'dataloader'
import { ApolloError } from 'apollo-errors'
import request from '../plugins/request.plugin'
import { logError } from '../middlewares/logger.middleware'
import { cacheMap as URLCacheMap, searchCache, updateCache } from '../plugins/lru-cache.plugin'
import { getJwtSign } from '../helpers/literal.helper'
import { isStatic, loaderConfig } from '~env'

/**
 * NOTE
 * As long as `*lodash.pick*` is used for collect body params from argument,
 * and param name matches`/^\w+$/`,
 * the order of `JSON.stringif(body)` can be guaranteed
 * @param {String} path // pathname
 * @param {Object} body // request body parameters
 * @param {Enum} jwt
 */
const cacheKeyFn = ({ path, body }) => `${path}|${JSON.stringify(body || '')}`
const cacheKeyLRU = ({ path, body, jwt = '' }) => `${path}|${JSON.stringify(body || '')}|${getJwtSign(jwt)}`
// default Dataloader options
const defaultOpts = { batch: false, cache: true, cacheKeyFn }

// const bodyEntries = _sortBy(Object.entries(body), [e => e])

export class Loader {
  /**
   *
   * @param {Object} config Loader configs: { headers, lruCache, httpMethod }
   * @param {Object} options dataloader options https://github.com/graphql/dataloader#api
   */
  constructor(config, options = {}) {
    if (config) {
      this.setConfig(config)
    }
    this.$dlConfig = Object.assign({}, defaultOpts, options)
    this.$loader = new Dataloader(keys => this.$fetch(keys), this.$dlConfig)
  }

  $loader = {}
  $auth = false
  /**
   * @description: if options.cache = false, consider enable lru (FIFO) cache
   */
  $cacheMap
  $dlConfig = defaultOpts
  $headers = {}
  $httpMethod = 'post'

  $setHeaders(headers) {
    if (!headers) return this
    const bearer = _get(headers, 'authorization')
    const jwt = _get(headers, 'authorization-token')
    if (bearer) this.$headers.Authorization = bearer
    if (jwt) this.$headers['Authorization-Token'] = jwt
  }

  $fetch = keys => Promise.all(
    keys.map(key => (isStatic ? this.$fetchStatic(key) : this.$fetchRemote(key)))
  )

  $fetchRemote({ path, body }) {
    const { $auth, $httpMethod, $cacheMap } = this
    let opts = {}
    let jwt
    let cached
    let keyLRU = ''

    if ($auth) {
      const bearer = this.$headers.Authorization
      if (!bearer && !isStatic) {
        throw new ApolloError('Set headers.Authorization in non-static mode')
      }
      if (bearer) opts = { headers: this.$headers }
    }

    if ($cacheMap) {
      keyLRU = cacheKeyLRU({ path, body, jwt })
      cached = searchCache($cacheMap, keyLRU)
    }

    return typeof cached == 'undefined'
      ? request[$httpMethod](path, body, opts)
        .then(e => _get(e, 'data'))
        .then(e => ($cacheMap ? updateCache($cacheMap, keyLRU, e) : e))
      : cached
  }

  $fetchStatic({ path, opts }) {
    try {
      const fileName = opts.stubName || 'success'
      const res = loaderConfig.mock(path, fileName)
      return res.body
    } catch (err) {
      logError(err, 'fStatic', path)
    }
  }

  setConfig(config) {
    if (!config) return this
    const { headers, cacheMap, httpMethod, auth } = config
    if (headers) {
      this.$setHeaders(config.headers)
    }
    this.$auth = !!auth
    if (cacheMap) this.$cacheMap = URLCacheMap
    if (httpMethod) this.$httpMethod = httpMethod
    return this
  }

  // cache: dataloader 1st, lru 2nd
  load(path, body, opts = {}) {
    // log.warn(`${path} ${JSON.stringify(body)} ${JSON.stringify(opts)}`)
    if (opts.httpMethod) this.$httpMethod = opts.httpMethod
    if (opts._forceUpdate) {
      this.$loader.clear({ path, body })
      const $cacheMap = this.$cacheMap
      if ($cacheMap) {
        const jwt = this.$auth ? this.$headers['Authorization-Token'] : ''
        $cacheMap.del(cacheKeyLRU({ path, body, jwt }))
      }
    }
    return this.$loader.load({ path, body, opts }) // todo test return diff stub
  }
}

export const loader = new Loader()
