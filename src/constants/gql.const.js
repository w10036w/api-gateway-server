export const fieldDefs = {
  jwt: 'String!',
  seskey: 'String',
  branchCode: 'Int!',
  language: 'String!',
  userId: 'String',
  pfId: 'String',
}
// 0 means current api does not support the function, vice versa
export const cursorFlags = {
  after: 0,
  before: 0,
  filter: 0,
  sort: 0, // orderBy  enum OrderBy { id_DESC title_ASC }
  first: 0,
}

export const mockPaginationFlags = { ...cursorFlags }
