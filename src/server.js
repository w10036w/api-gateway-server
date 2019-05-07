import Koa from 'koa'
import koaBody from 'koa-bodyparser'
import chalk from 'chalk'
import { server as graphqlServer } from './graphql'
import { middleware as logger, log } from './middlewares/logger'
// import { middleware as ratelimit } from './middlewares/ratelimit'
import { name } from '../package.json'
import { PORT, GQL_PATH, DATA_ENV, isProd } from '~env'

global.log = log
chalk.enabled = !isProd
const hasParent = module.parent

const app = new Koa()
app.use(koaBody())
// * middlewares -> `src/middlewares`
const middlewares = {
  // cors,
  // ratelimit,
  // cacheJwt,
  logger,
  // route,
}
const middlewareKeys = Object.keys(middlewares)
middlewareKeys.forEach(e => app.use(middlewares[e]()))

graphqlServer.applyMiddleware({ app, path: GQL_PATH })

const boot = async () => {
  if (!isProd) {
    // Ignore any cert errors on development environment
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }
  await app.listen(PORT)
  const info = chalk.cyan(`[${name}|${DATA_ENV}] on 127.0.0.1:${PORT} [${middlewareKeys}]`)
  log.info(info)
}

if (!hasParent) boot()

export default app
