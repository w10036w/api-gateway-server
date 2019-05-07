import { makeExecutableSchema } from 'graphql-tools'
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
// directives
import uppercase from './directives/uppercase'
// schemas
import constS from './models/_const'
import exampleS from './models/_example'
// resolvers
import * as constR from './resolvers/_const'
import exampleR from './resolvers/_example'

const schemaFiles = [constS, exampleS]
const resolverFiles = [constR, exampleR]

const typeDefs = mergeTypes(schemaFiles, { all: true })
const resolvers = mergeResolvers(resolverFiles)
const schemaDirectives = {
  uppercase,
}
export const schema = makeExecutableSchema({ typeDefs, resolvers, schemaDirectives })
