
// import customized / global scalar here
import { gql } from 'apollo-server-koa'

export default gql`
  scalar DateTime
  scalar DateYYMD

  directive @deprecated(
    reason: String = "No longer supported"
  ) on FIELD_DEFINITION | ARGUMENT_DEFINITION | INPUT_FIELD_DEFINITION| OBJECT | FIELD | QUERY
  directive @uppercase on FIELD_DEFINITION
`
