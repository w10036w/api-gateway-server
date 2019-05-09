import LRU from 'lru-cache'
import { JWT_EXPIRE } from '~env'

const defaultOpts = {
  max: 1000,
  // length: (n, key) => n * 2 + key.length,
  // dispose: (_, n) => { n.close() },
  maxAge: JWT_EXPIRE,
}

/**
 * NOTE usage
 * `let otherCache = new Cache(50) // sets just the max size`
 * `set(key, value, maxAge)`
 * `get(key) // undefined if not exists`
 * `peek(key) // get without updating recently used`
 * `has(key) // check without updating recently used`
 * `forEach(function(value,key,cache), [thisp]) // interates all keys, most recent the 1st`
 * `del(key)`
 * `reset()`
 */
export const newCache = opts => new LRU(opts || defaultOpts)
export const cacheMap = new LRU()

// for database seed
export const findOrSaveCache = (cache, key, value, maxAge = defaultOpts.maxAge) => {
  if (cache.has(key)) {
    return false
  }
  cache.set(key, value, maxAge)
  // log.info
  return value
}

export const searchCache = (cache, key) => {
  if (cache.has(key)) {
    log.info(chalk.yellowBright(`[lrucach] ${chalk.bold('GET')} ${key}`))
    return cache.get(key)
  }
}

// for update item
export const updateCache =  (cache, key, value, maxAge = defaultOpts.maxAge) => {
  cache.set(key, value, maxAge)
  log.info(chalk.yellowBright(`[lrucach] ${chalk.bold('SET')} ${key}`))
  return value
}


