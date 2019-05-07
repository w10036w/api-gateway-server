import { inspect } from 'util'
import axios from 'axios'
import tunnel from 'tunnel'
import { logError } from '../middlewares/logger.middleware'
import { rePath } from '../constants'
import { BASE_URL, REQ_TIMEOUT, PROXY, isProd } from '~env'

const getPath = url => (url ? `/${url.match(rePath)[1]}` : 'invalid url')

let httpsAgent
if (PROXY) {
  httpsAgent = tunnel.httpsOverHttp({
    proxy: {
      host: PROXY.host,
      port: PROXY.port,
    },
  })
}

const request = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'timeout': REQ_TIMEOUT,
  },
  httpsAgent,
})

if (!isProd) {
  request.interceptors.request.use(
    opts => {
      const { url, data: body } = opts
      const token = opts.headers.Authorization
      const jwt = opts.headers['Authorization-Token']
      log.info(chalk.blue.bold(`[request] ${url}`))
      if (token) log.info(`token from api: ${token}`)
      if (jwt) log.info(`jwt: ${jwt}`)
      log.info(`[reqbody] ${JSON.stringify(body)}`)
      return opts
    },
    err => {
      log.error(`[ reqerr] ${inspect(err).slice(0, 400)}\n`)
    }
  )

  request.interceptors.response.use(
    res => {
      log.info(chalk.green.bold(`[respons] ${getPath(res.config.url)}`))
      const resbody = JSON.stringify(res.data)
      const len = resbody.length
      const [last, suffix] = len > 1000 ? [1000, '...'] : [len, '']
      log.info(`[resbody] ${resbody.slice(0, last)}${suffix}`)
      return res
    },
    err => {
      logError(err, 'reserr', getPath(err.config.url))
      if (err.code === 'ECONNREFUSED') {
        //! env down
        log.error(`Server down in ${err.config.baseURL}\n`)
      } else if (err.response && err.response.status === 401) {
        //! invalid bearer token
        log.error(`Invalid bearer token in ${err.config.baseURL}\n`)
      } else {
        logError(err, 'reserr', '')
      }
    }
  )
}

export default request

export const gUrl = (scope, version = '1.0') => endpoint => `/${scope}/${version}/${endpoint}`
