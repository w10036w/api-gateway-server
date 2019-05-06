import slHttp from 'serverless-http'
import playground from 'graphql-playground-middleware-lambda'
import app from './server'

exports.graphql = slHttp(app)

// https://github.com/dherault/serverless-offline/issues/434#issuecomment-399310526
// exports.playground = async () => {
//   const service = await playground({
//     endpoint: '/graphql',
//   })
//   return service
// }
exports.playground = playground({
  endpoint: '/graphql',
})

// import { ApolloServer } from 'apollo-server-lambda'
// import playground from 'graphql-playground-middleware-lambda'
// import { config as apolloConfig } from './graphql'

// const server = new ApolloServer(apolloConfig)
// exports.graphql = server.createHandler()
