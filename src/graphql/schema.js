import { makeExecutableSchema } from 'graphql-tools'
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
// directives
import uppercase from './directives/uppercase'
// schemas
import sCONST from './models/_const'
import sMock from './models/_mock'
// resolvers
import * as rCONST from './resolvers/_const'
import rMock from './resolvers/_mock'

const schemaFiles = [sCONST, sMock]
const resolverFiles = [rCONST, rMock]

const typeDefs = mergeTypes(schemaFiles, { all: true })
const resolvers = mergeResolvers(resolverFiles)
const schemaDirectives = {
  uppercase,
}
export const schema = makeExecutableSchema({ typeDefs, resolvers, schemaDirectives })
