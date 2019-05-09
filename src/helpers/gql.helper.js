// * generate filterId for _filter
// todo expression e.g. "id>3", "id=/^whatever$/"
export const gFilterId = input => {
  // * json string "{"completed":true}"
  const cond = JSON.parse(input)
  return e => Object.keys(cond).every(key => e[key] === cond[key])
}

// * generate sortId for _sortBy
// todo const orders = sortString.split(/-|+/g)
// todo e.g -id+title / id_DESC title_ASC (primsa)
export const gSortId = sortString => (prev, next) => next.id > prev.id

/**
 * apply cursor-based pagination
 * @param {Array} list input data
 * @param {Object} opts options
 */
export const applyCursor = (list, opts) => {
  let listClone
  if (opts) {
    // ! create a copy to avoid mutating
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
      // todo limit first<100
      listClone = _slice(listClone, 0, first)
    }
    if (sort) {
      const sortId = args.sortId || gSortId(sort)
      listClone = _sortBy(listClone, sortId)
    }
  } else {
    // * do nothing if pre-supported cursor-based
    listClone = list
  }
  const edges = listClone.map(e => ({
    cursor: e[opts.cursorName],
    node: e,
    // todo cursor-level fields, e.g. createAt
  }))
  return { edges }
}

/**
 * apply offset-based pagination
 * @param {Array} list input data
 * @param {Object} opts options
 */
export const applyOffset = (list, opts) =>
  list

