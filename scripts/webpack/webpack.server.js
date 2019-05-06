const merge = require('webpack-merge')
const common = require('./webpack.common')

// bundle excludes node_modules in development, or as config
const excludeNodes = process.env.EXCLUDE_MODULES === 'true'
const isProd = process.env.NODE_ENV === 'production'

const serverConfig = excludeNodes || !isProd ? common : { ...common, externals: [] }

module.exports = merge(serverConfig)
