import Dataloader from 'dataloader'
import { ApolloError } from 'apollo-errors'
import penv from 'penv.macro'
import request from '../plugins/request'
import { logError } from '../middlewares/logger'
import { cache, updateCache } from '../plugins/lru-cache'
import { isStatic } from '~env'

const getJwtSign = jwt => (jwt ? jwt.split('.')[2] : '')

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
  constructor(config, options = {}) {
    if (config) {
      this.setConfig(config)
    }
    // dataloader options: https://github.com/graphql/dataloader#api
    this.$dlConfig = Object.assign({}, defaultOpts, options)
    this.$loader = new Dataloader(keys => this.$fetch(keys), this.$dlConfig)
  }

  $loader = {}
  /**
   * @description: if options.cache = false, consider enable lru (FIFO) cache
   */
  $lruConfig = { enabled: false }
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
    const [bearer, jwt] = _values(this.$headers)
    // log.warn(`bearer: ${bearer}, jwt: ${jwt}`)
    // if (!bearer && !isStatic) {
    //   throw new ApolloError(
    //     "Please set Authorization in http headers when DATA_ENV !== static"
    //   )
    // }
    const opts = (bearer || jwt) ? { headers: this.$headers } : {}
    const { enabled: lruEnabled } = this.$lruConfig
    let keyLRU = ''
    if (lruEnabled) {
      keyLRU = cacheKeyLRU({ path, body, jwt })
      if (cache.has(keyLRU)) {
        log.info(chalk.yellowBright(`[lrucach] old ${keyLRU}`))
        return cache.get(keyLRU)
      }
      log.info(chalk.yellow(`[lrucach] new ${keyLRU}`))
    }

    const httpMethod = this.$httpMethod
    return request[httpMethod](path, body, opts)
      // .then(e => updateCache(keyLRU, _get(e, 'data')))
      .then(e => _get(e, 'data'))
      .then(e => (lruEnabled ? updateCache(keyLRU, e) : e))
      .catch(err => logError(err, 'fRemote', path))
  }

  $fetchStatic({ path, opts }) {
    try {
      const fileName = opts.stubName || 'success'
      const res = penv({
        development: require(`../../stubs${path}/${fileName}.json`),
        production: { body: null },
      })
      return res.body
    } catch (err) {
      logError(err, 'fStatic', path)
    }
  }

  setConfig(config) {
    if (!config) return this
    const { headers, lruCache, httpMethod } = config
    if (headers) {
      this.$setHeaders(config.headers)
    }
    if (lruCache === true) this.$lruConfig = { enabled: true, cacheMap: cache }
    if (httpMethod) this.$httpMethod = httpMethod
    return this
  }

  // cache: dataloader 1st, lru 2nd
  load(path, body, opts = {}) {
    // log.warn(`${path} ${JSON.stringify(body)} ${JSON.stringify(opts)}`)
    if (opts.httpMethod) this.$httpMethod = opts.httpMethod
    if (opts.cache === false) {
      this.$loader.clear({ path, body })
      log.warn(`[ loader] clear ${cacheKeyFn({ path, body })}`)
    }
    return this.$loader.load({ path, body, opts }) // todo test return diff stub
  }
}

export const loader = new Loader()
