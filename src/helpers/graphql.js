import { camelCase } from 'lodash'
// string
const capitalOnly = str => str.replace(/^[a-z]/, s => s.toUpperCase())
const kebab2pascal = _flow(camelCase, capitalOnly)
const paddingInput = str => 'i' + str

export const obj2fields = obj => {
  let r = ''
  Object.keys(obj).forEach(e => {
    r += `${e}: ${obj[e]}\n`
  })
  return r
}

export const obj2type = (obj, name) => `${name}{${obj2fields(obj)}}`

export const endpoint2type = kebab2pascal
export const endpoint2query = camelCase
export const endpoint2input = _flow(kebab2pascal, paddingInput)

// todo what if edge-level filter
export const gFilterId = filterString => {
  // * json string "{"completed":true}"
  const cond = JSON.parse(filterString)
  return e => Object.keys(cond).every(key => e[key] === cond[key])
  // todo expression e.g. "id>3", "id=/^whatever$/"
}

// * -id+title / id_DESC title_ASC (primsa)
// todo const orders = sortString.split(/-|+/g)
export const gSortId = sortString => (prev, next) => next.id > prev.id

// todo cursor-level fields
export const applyEdges = (list, opts) => {
  let listClone
  if (opts) {
    // ! create a copy to avoid affecting cached list
    listClone = _flow(JSON.stringify, JSON.parse)(list)
    // ? need to do all / partial tasks with no support from api
    const args = opts.args
    const keys = Object.keys(args).filter(e => !opts.flags[e])
    // todo before
    const { after, before, filter, first, sort } = _pick(args, keys)
    if (after) {
      const startIndex = listClone.findIndex(e => e[opts.cursorName] === after) + 1
      // log.warn(`${typeof e[opts.cursorName])}, ${typeof after}`)
      listClone = _slice(listClone, startIndex)
    }
    if (before) {
      // todo
    }
    if (filter) {
      const filterId = args.filterId || gFilterId(filter)
      listClone = _filter(listClone, filterId)
    }
    if (first && listClone.length > first) {
      listClone = _slice(listClone, 0, first)
    }
    if (sort) {
      const sortId = args.sortId || gSortId(sort)
      listClone = _sortBy(listClone, sortId)
    }
  } else {
    // * do nothing with cursor-based support from api
    listClone = list
  }
  const edges = listClone.map(e => ({
    cursor: e[opts.cursorName],
    node: e,
    // todo cursor-level fields, e.g. createAt
  }))
  return { edges }
}
export const applyPages = (list, opts) =>
  // todo something
  list

