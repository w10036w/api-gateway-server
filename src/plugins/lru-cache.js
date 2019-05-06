import LRU from 'lru-cache'
import { JWT_EXPIRE } from '~env'

const opts = {
  max: 1000,
  // length: (n, key) => n * 2 + key.length,
  // dispose: (_, n) => { n.close() },
  maxAge: JWT_EXPIRE,
}

/**
 * NOTE usage
 * `set(key, value, maxAge)`
 * `get(key) // undefined if not exists`
 * `peek(key) // get without updating recently used`
 * `has(key) // check without updating recently used`
 * `forEach(function(value,key,cache), [thisp]) // interates all keys, most recent the 1st`
 * `del(key)`
 * `reset()`
 */
export { LRU }
export const cache = new LRU(opts)
export const findOrSaveCache = (key, value, maxAge = opts.maxAge) => {
  if (cache.has(key)) {
    return false
  }
  cache.set(key, value, maxAge)
  return value
}
export const updateCache =  (key, value, maxAge = opts.maxAge) => {
  cache.set(key, value, maxAge)
  return value
}
/**
 * NOTE usage
 * `let otherCache = new Cache(50) // sets just the max size`
 */
export const Cache = LRU


