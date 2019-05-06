export default gql`
  type Todo {
    id: ID! # @deprecated
    userId: Int!
    title: String! # @uppercase
    completed: Boolean!
  }
  # // * cursor-base cost
  type TodoEdge {
    cursor: ID! # id
    node: Todo
    # extra fields
  }
  type TodosConnection {
    edges: [TodoEdge!]
  }
  type Query {
    todos: [Todo!]
    todosConnection(first: Int=15, after: ID, filter: String, sort: String): TodosConnection! # https://blog.apollographql.com/explaining-graphql-connections-c48b7c3d6976
    # TODO directive @connect https://facebook.github.io/relay/docs/en/pagination-container.html#pagination-example
    todo(
      id: Int!, 
      stubName: String,
      cache: Boolean = true
    ): Todo
  }
`
