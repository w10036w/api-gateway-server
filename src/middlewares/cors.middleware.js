import koaCors from 'kcors'

const devBypass = (whitelist, origin) => {
  const re = whitelist.includes('localhost') && origin.includes('localhost:')
  return re
}

export const middleware = whitelist => {
  function orginFilter(ctx) {
    const reqOrigin = ctx.accept.headers.origin
    if (!devBypass(whitelist, reqOrigin) && !whitelist.includes(reqOrigin)) {
      ctx.body = `[koaCors] ${reqOrigin} is not allowed`
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

// export const middleware = whitelist => {
//   return async (ctx, next) {

//     next()
//   }
// }
