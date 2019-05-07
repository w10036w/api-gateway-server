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
export const getJwtSign = jwt => (jwt ? jwt.split('.')[2] : '')

