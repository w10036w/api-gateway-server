const { optimize } = require('webpack')
const nodeExternals = require('webpack-node-externals')
const paths = require('../paths')

const { ModuleConcatenationPlugin } = optimize

const excludeNodeConfig = {
  externals: [
    nodeExternals({
      modulesFromFile: true,
    }),
  ],
}
exports.excludeNodeConfig = excludeNodeConfig

module.exports = {
  mode: 'production',
  entry: './src/server.js',
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    path: paths.appBuild,
    filename: '[name].js',
  },
  // NOTE if need to exclude node_modules
  ...excludeNodeConfig,
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
  plugins: [
    // https://webpack.js.org/plugins/module-concatenation-plugin/
    new ModuleConcatenationPlugin(),
  ],
}
// TODO watch graphql
// https://github.com/jaredpalmer/backpack/issues/115
