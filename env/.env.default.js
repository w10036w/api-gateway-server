// ! do not use same names in non-regional config
export const BASE_URL = 'https://jsonplaceholder.typicode.com/'
export const DATA_ENV = process.env.DATA_ENV || 'mock' // region

export const isStatic = DATA_ENV === 'static'
