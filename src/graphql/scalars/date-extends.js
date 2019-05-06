import { GraphQLScalarType } from 'graphql'
import { GraphQLError } from 'graphql/error'
import { Kind } from 'graphql/language'

// NOTE
// * DateYYMD           yyyy-mm-dd             /\d{4}-\d{2}-\d{2}/                     e.g. 2019-05-01
// * DateTimeYYMDHMS    yyyy-mm-dd hh:mm:ss    /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/   e.g. 10 May 2019 17:00:00
// rare
// * DateDMMYY          dd MMM yyyy            /\d{2} \w{3} \d{4}/                     e.g. 10 May 2019
// * DateTimeYYMDHMSTZ  yyyy-mm-dd hh:mm:ss TZ /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [A-Z]{3}/  e.g. 10 May 2019 17:00:00
// todo further validation e.g. yyyy -> 1900+
// todo test cases refer to
// https://github.com/okgrow/graphql-scalars/blob/master/src/__tests__/DateTime.test.js

const YYYY_MM_DD = new RegExp(/^\d{4}-\d{2}-\d{2}$/)

export const GraphQLDateYYMD = new GraphQLScalarType({
  name: 'DateYYMD',
  description: 'A field whose value conforms to the standard calendar date format as specified in ISO_8601: https://en.wikipedia.org/wiki/ISO_8601#Calendar_dates.',
  serialize(value) {
    if (typeof value !== 'string') {
      throw new TypeError(`Value is not string: ${value}`)
    }
    if (!YYYY_MM_DD.test(value)) {
      throw new TypeError(`Value is not a valid email address: ${value}`)
    }
    return value
  },
  parseValue(value) {
    if (typeof value !== 'string') {
      throw new TypeError('Value is not string')
    }
    if (!YYYY_MM_DD.test(value)) {
      throw new TypeError(`Value is not a valid email address: ${value}`)
    }
    return value
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as email addresses but got a: ${ast.kind}`,
      )
    }
    if (!YYYY_MM_DD.test(ast.value)) {
      throw new TypeError(`Value is not a valid email address: ${ast.value}`)
    }
    return ast.value
  },
})
