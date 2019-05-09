import { ApolloServer } from 'apollo-server-koa'
import { formatError, ApolloError } from 'apollo-errors'
import depthLimit from 'graphql-depth-limit'
import costAnalysis from 'graphql-cost-analysis'
import { loader, Loader } from './loader'
import { schema } from './schema'
import { isProd, loaderConfig } from '~env'

// https://github.com/pa-bru/graphql-cost-analysis/issues/12#issuecomment-466983675
// ! update once the library udpates
// ! temp hack only
// ! known issue: variables still occasionally break
// class CostAnalysisApolloServer extends ApolloServer {
//   async createGraphQLServerOptions(ctx) {
//     const options = await super.createGraphQLServerOptions(ctx)

//     options.validationRules = options.validationRules || []
//     options.validationRules.push(
//       costAnalysis({
//         variables: ctx && _get(ctx, 'request.body.variables'),
//         maximumCost: 1000,
//         defaultCost: 1,
//         onComplete: cost => {
//           log.info(`[gqlcost] ${chalk.bold.green(cost)}`)
//         },
//         createError: (maxCost, cost) => new ApolloError(`cost: ${cost}(actual)>${maxCost}(maximum)`),
//       })
//     )

//     return options
//   }
// }

const { dataloader, lru, auth } = loaderConfig
const ctxLoader = (config, options) => (dataloader ? loader.setConfig(config) : new Loader(config, options))

const server = new ApolloServer({
  context: ({ ctx }) => {
    const headers = _get(ctx, 'request.header') // ctx undefined when server inits
    return {
      loader: ctxLoader({ headers, lru, auth }),
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
