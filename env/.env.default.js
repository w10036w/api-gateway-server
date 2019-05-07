export * from './.env.general.js'

// * env specific,
// ! do not use same names in non-regional config
export const BASE_URL = 'https://jsonplaceholder.typicode.com/'
export const DATA_ENV = process.env.DATA_ENV || 'static' // region
export const isStatic = DATA_ENV === 'static'

export const PROXY = ''

