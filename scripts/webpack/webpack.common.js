const nodeExternals = require('webpack-node-externals')
const paths = require('../paths')

const inclusive = process.env.INCLUSIVE === 'true'

const excludeNodeModules = nodeExternals({
  modulesFromFile: true,
  target: 'node',
})

module.exports = {
  mode: 'production',
  entry: './src/server.js',
  target: 'node',
  externals: inclusive ? [] : [excludeNodeModules],
  output: {
    libraryTarget: 'commonjs',
    path: paths.appBuild,
    filename: '[name].js',
  },
  stats: {
    colors: true,
    reasons: false,
    chunks: false,
  },
  performance: {
    hints: false,
  },
  // https://webpack.js.org/configuration/resolve/
  resolve: {
    // https://github.com/graphql/graphql-js/issues/1272
    mainFields: ['browser', 'main', 'module'],
    extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: paths.appNodeModules },
      // { test: /\.json$/, loader: 'json-loader' },
      // { test: /\.(graphql|gql)$/, exclude: paths.appNodeModules, loader: 'graphql-tag/loader' },
      {
        test: /\.(ts|tsx)$/,
        include: paths.appSrc,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
              configFile: paths.appTsProdConfig,
            },
          },
        ],
      },
    ],
  },
}
