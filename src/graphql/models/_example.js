export default gql`
  type Query {
    todo(id: Int!, stubName: String, cache: Boolean = true): Todo
    todos: [Todo!]
    todosConnection(first: Int = 15, after: ID, filter: String, sort: String): TodosConnection! # https://blog.apollographql.com/explaining-graphql-connections-c48b7c3d6976
    # TODO directive @connect https://facebook.github.io/relay/docs/en/pagination-container.html#pagination-example
    parent: Parent
  }

  type Todo {
    id: ID! # @deprecated
    userId: Int!
    title: String! # @uppercase
    completed: Boolean!
  }
  type TodosConnection {
    edges: [TodoEdge!]
  }
  # // * cursor-base additional
  type TodoEdge {
    cursor: ID! # id
    node: Todo
    # extra fields
  }
  type Parent {
    child1: Int!
    child2(userId: String): String
  }
`
