const slsw = require('serverless-webpack')
const merge = require('webpack-merge')
// const nodeExternals = require('webpack-node-externals')
const common = require('./webpack.common')

const excludeNodes = process.env.EXCLUDE_MODULES === 'true'
const isProd = process.env.NODE_ENV === 'production'

const handlerConfig = excludeNodes || !isProd ? common : { ...common, externals: [] }

module.exports = merge(handlerConfig, {
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
})
