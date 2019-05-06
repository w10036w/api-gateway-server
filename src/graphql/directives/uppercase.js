import { SchemaDirectiveVisitor } from 'apollo-server-koa'
import { defaultFieldResolver } from 'graphql'

class UppercaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function(...args) {
      const result = await resolve.apply(this, args)
      if (typeof result === 'string') {
        return result.toUpperCase()
      }
      return result
    }
  }
}

export default UppercaseDirective
