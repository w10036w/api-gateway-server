// https://github.com/chengjianhua/penv.macro/blob/master/src/macro.js
// import penv from 'penv.macro'

// const data = penv({
//   development: 'devBase',
//   production: 'prodBase',
//   static: 'staticBase',
// })

// * env specific
export const BASE_URL = 'https://jsonplaceholder.typicode.com/'
export const DATA_ENV = process.env.DATA_ENV || 'mock' // region

export const isStatic = DATA_ENV === 'static'

// * general
export const PORT = 8000
export const GQL_PATH = '/graphql'
export const REQ_TIMEOUT = 5000
export const JWT_EXPIRE = 1000 * 60 * 30 // 30 min
export const RATE_LIMIT = 1000 // requests per min
export const ENV = process.env.NODE_ENV || 'development'

export const isProd = ENV === 'production'
