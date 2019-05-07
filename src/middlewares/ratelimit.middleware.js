// NOTE
// ! need to enable redis to use ratelimit,
// !or it will import sequalize, meaning cannot bundle this module in.
// https://github.com/ysocorp/koa2-ratelimit
import { RateLimit } from 'koa2-ratelimit'
import { RATE_LIMIT } from '~env'

export const middleware = () => RateLimit.middleware({
  // statusCode: 429,
  // message: 'Too many requests, please try again later.',
  // whitelist: WHILTE_LIST,
  timeWait: 0,
  interval: { min: 1 }, // 15 minutes = 15*60*1000
  max: RATE_LIMIT, // limit each IP to 100 requests per interval
})
