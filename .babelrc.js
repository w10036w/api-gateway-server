// todo isolate in default environment
// NOTE
// first in-order exec plugins
// then reverse exec presets
const resolver = [
  'module-resolver',
  {
    alias: {
      '~graphql': './src/graphql',
      '~env': './.env.js',
    },
  },
]

const provides = [
  'provide-modules',
  {
    'apollo-server-koa': ['gql'],
    'bluebird': 'Promise', // node > v10 can stop using bluebird since there is little gap
    'chalk': 'chalk',
    'lodash': [
      { filter: '_filter' },
      { flow: '_flow' },
      { pick: '_pick' },
      { slice: '_slice' },
      { sortBy: '_sortBy' },
      { isEmpty: '_isEmpty' },
      { get: '_get' },
      { values: '_values' },
    ],
  },
]
const stages = [
  // Stage 0
  '@babel/plugin-proposal-function-bind',
  // Stage 1
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-logical-assignment-operators',
  ['@babel/plugin-proposal-optional-chaining', { loose: false }],
  ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
  ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: false }],
  '@babel/plugin-proposal-do-expressions',
  // Stage 2
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  '@babel/plugin-proposal-function-sent',
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/plugin-proposal-numeric-separator',
  '@babel/plugin-proposal-throw-expressions',
  // Stage 3
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-syntax-import-meta',
  ['@babel/plugin-proposal-class-properties', { loose: false }],
  '@babel/plugin-proposal-json-strings',
]
// const cherryPick = [
//   ['import', { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false }, 'lodash'],
//   // ['import',
//   // { libraryName: 'graphql-tools', libraryDirectory: 'dist', camel2DashComponentName: false }, "graphql-tools"],
// ]
const cherryPick = [
  'transform-imports',
  {
    lodash: {
      transform: 'lodash/${member}',
      preventFullImport: true,
    },
  },
]

const plugins = [resolver, 'macros', cherryPick, provides, ...stages]
const presets = [
  [
    '@babel/env',
    {
      targets: { node: true }, // ='current'
      // modules: 'commonjs',  // default
      corejs: '3',
      useBuiltIns: 'usage',
    },
  ],
]

// The env key will be taken from process.env.BABEL_ENV,
// when this is not available then it uses process.env.NODE_ENV
// if even that is not available then it defaults to "development".
const env = {
  production: {
    plugins,
    // https://github.com/babel/minify/tree/master/packages/babel-preset-minify#1-1-mapping-with-plugin
    presets: [...presets, 'babel-preset-minify'],
  },
}

module.exports = { plugins, presets, env }
