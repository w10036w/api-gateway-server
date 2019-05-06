import koaCors from 'kcors'

const devBypass = (whitelist, origin) => {
  const re = whitelist.includes('localhost') && origin.includes('localhost:')
  return re
}

export const middleware = whitelist => {
  function orginFilter(ctx) {
    const reqOrigin = ctx.accept.headers.origin
    log.debug(reqOrigin)
    if (!devBypass(whitelist, reqOrigin) && !whitelist.includes(reqOrigin)) {
      ctx.body = `[CORS] ${reqOrigin} is not allowed`
      return
    }
    return reqOrigin
  }
  const corsConfig = {
    origin: orginFilter,
    // allowMethods: [],
    // credentials: true
  }
  return koaCors(corsConfig)
}
