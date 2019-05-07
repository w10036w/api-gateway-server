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

export const PORT = 8000
export const GQL_PATH = '/graphql'
export const REQ_TIMEOUT = 5000
export const JWT_EXPIRE = 1000 * 60 * 30 // 30 min
export const RATE_LIMIT = 1000 // requests per min

export const mockData = penv({
  development: (path, fileName) => require(`./stubs${path}/${fileName}.json`),
  production:() => ({ body: null }),
})
export const cacheConfig = penv({
  development: {
    lru: false,
    solodataloader: false, // true = only one dataloader is created for all requests
    dataloader: false,
  },
  production: {
    lru: true,
    solodataloader: true,
    dataloader: false,
  },
})

export const ENV = process.env.NODE_ENV || 'development'

export const isProd = ENV === 'production'
