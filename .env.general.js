/**
 * * Non-regional config
 */

// https://github.com/chengjianhua/penv.macro/blob/master/src/macro.js
// if need some env specific configs,
import penv from 'penv.macro'
// format:
// const data = penv({
//   development: 'devOnly',
//   production: 'prodOnly',
//   test: 'testOnly',
// })

export * from './.env.js'

export const PROXY = ''

export const PORT = 8000
export const GQL_PATH = '/graphql'
export const REQ_TIMEOUT = 5000
export const JWT_EXPIRE = 1000 * 60 * 30 // 30 min
export const RATE_LIMIT = 1000 // requests per min

export const loaderConfig = penv({
  development: {
    // ? cache resolver (higher)
    // 0 = dataloader cache only within a query to prevent N+1
    // 1 = only one dataloader cache for every query hence lru cache will be useless
    dataloader: 0,
    // ? cache service endpoint response (lower)
    // 0 = disable
    // 1 = enable
    lru: 0,
    // 0 = disable authentication
    auth: 0,
    mock: (path, fileName) => require(`./stubs${path}/${fileName}.json`),
  },
  production: {
    dataloader: 1,
    lru: 1,
    auth: 0,
    mock: () => ({ body: null }),
  },
})

export const ENV = process.env.NODE_ENV || 'development'

export const isProd = ENV === 'production'

