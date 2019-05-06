import { makeExecutableSchema } from 'graphql-tools'
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
// directives
import uppercase from './directives/uppercase'
// schemas
import sCONST from './models/_const'
import sMock from './models/_mock'
import sUserprofile from './models/userprofile'
// resolvers
import * as rCONST from './resolvers/_const'
import rMock from './resolvers/_mock'
import rUserprofile from './resolvers/userprofile'

const schemaFiles = [sCONST, sUserprofile, sMock]
const resolverFiles = [rCONST, rUserprofile, rMock]

const typeDefs = mergeTypes(schemaFiles, { all: true })
const resolvers = mergeResolvers(resolverFiles)
const schemaDirectives = {
  uppercase,
}
export const schema = makeExecutableSchema({ typeDefs, resolvers, schemaDirectives })
