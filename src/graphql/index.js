import { ApolloServer } from 'apollo-server-koa'
import { formatError, ApolloError } from 'apollo-errors'
import depthLimit from 'graphql-depth-limit'
import costAnalysis from 'graphql-cost-analysis'
import { loader, Loader } from './loader'
import { schema } from './schema'
import { isProd, cacheConfig } from '~env'

// https://github.com/pa-bru/graphql-cost-analysis/issues/12#issuecomment-466983675
// ! update once the library udpates
// ! temp hack only
class CostAnalysisApolloServer extends ApolloServer {
  async createGraphQLServerOptions(ctx) {
    const options = await super.createGraphQLServerOptions(ctx)

    options.validationRules = options.validationRules || []
    options.validationRules.push(
      costAnalysis({
        variables: ctx && _get(ctx, 'request.body.variables'),
        maximumCost: 1000,
        defaultCost: 1,
        onComplete: cost => {
          log.info(`[gqlcost] ${chalk.bold.green(cost)}`)
        },
        createError: (maxCost, cost) => new ApolloError(`cost: ${cost}(actual)>${maxCost}(maximum)`),
      })
    )

    return options
  }
}
const ctxLoader = (config, options) => (cacheConfig.solodataloader
  ? loader.setConfig(config)
  : (new Loader(config, options)))

const server = new CostAnalysisApolloServer({
  context: ({ ctx }) => {
    const headers = _get(ctx, 'request.header') // ctx undefined when server inits
    return {
      // loader: loader.setConfig({ headers }),
      // if need for isolate cache / different authorization level in a single query
      loader: ctxLoader({ headers, lruCache: cacheConfig.lru }, { cache: cacheConfig.dataloader }),
    }
  },
  // rootValue: {},
  schema,
  validationRules: [depthLimit(10)],
  introspection: true, // FIXME  disable this in production
  playground: true, // FIXME disable this in production
  formatError,
  cacheControl: isProd ? { defaultMaxAge: 10 } : null,
  tracing: !isProd,
})

export { server, loader, Loader }
