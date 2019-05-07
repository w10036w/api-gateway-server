import { inspect } from 'util'
import { mockPaginationFlags } from '../../constants'
import { applyCursor, applyOffset } from '../../helpers/gql.helper'
// import { parsers } from '../models/_mock'

const Query = {
  /**
   * ** info:
   * cacheControl.cacheHint = { maxAge: 5 }
   * fieldName = 'todo'
   * fragments = {}
   * parentType = 'Query'
   * path = { key: 'todo' }
   * returnType: "Todo"
   * schema: { _directives: [], _queryType: 'Query', _mutationType: '' }
   * variableValues: {}
   */
  todo: async (_, args, ctx, info) => {
    const body = _pick(args, ['id'])
    const opts = Object.assign(
      {},
      { stubName: 'success', cache: false, httpMethod: 'get' },
      _pick(args, ['stubName', 'cache', 'httpMethod'])
    )
    const res = await ctx.loader.load(`/todos/${body.id}`, body, opts)
    return res
  },
  // * offset-base
  todos: async (_, args, ctx) => {
    const body = _pick(args, ['skip', 'limit', 'filter', 'sort'])
    const res = await ctx.loader.load('/todos', null)
    return applyOffset(res, body)
  },
  // * cursor-base
  todosConnection: async (_, args, ctx) => {
    const body = _pick(args, ['first', 'before', 'after', 'filter', 'sort'])
    // todo  if database / service support pagination / filter / sort, apply them in fetch first
    const res = await ctx.loader.load('/todos', null)
    return applyCursor(res, {
      flags: mockPaginationFlags,
      args: body,
      cursorName: 'id',
    })
  },

  async parent(_, args, ctx) {
    const child1 = await '1'
    return {
      child1: () => child1,
    }
  },
}

const Parent = {
  async child2(_, args, ctx) {
    log.warn(`I am in subquery ${inspect(ctx.loader.load)}`)
    const fields = args.userId || ''
    const res = await fields
    return res
  },
}
// const Mutation = {
//   addPost: async (_, args, ctx) =>
// }

export default { Query, Parent }
