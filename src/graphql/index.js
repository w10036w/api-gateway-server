import { formatError, ApolloError } from 'apollo-errors'
import depthLimit from 'graphql-depth-limit'
import costAnalysis from 'graphql-cost-analysis'
import { loader, Loader } from './loader'
import { schema } from './schema'
// env
import { isProd } from '~env'


const config = {
  context: ({ ctx }) => {
    const headers = _get(ctx, 'request.header') // ctx undefined when server inits
    return {
      // loader: loader.setConfig({ headers }),
      // if need for isolate cache / different authorization level in a single query
      loader: new Loader({ headers }),
    }
  },
  // rootValue: {},
  schema,
  validationRules: [
    depthLimit(10),
    costAnalysis({
      maximumCost: 1000,
      defaultCost: 1,
      onComplete: cost => {
        log.info(`[gqlcost] ${chalk.bold.green(cost)}`)
      },
      createError: (maxCost, cost) =>
        new ApolloError(`cost: ${cost}(actual)>${maxCost}(maximum)`),
    }),
  ],
  formatError,
  introspection: true, // enable in production
  cacheControl: isProd ? { defaultMaxAge: 5 } : {}, // NOTE dev disable cacheControl
  tracing: !isProd,
}

export { config, loader, Loader }
