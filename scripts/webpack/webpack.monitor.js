const WebpackMonitor = require('webpack-monitor')
const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  plugins: [
    new WebpackMonitor({
      capture: true, // -> default 'true'
      target: '../monitor/stats.json', // default -> '../monitor/stats.json'
      launch: true, // -> default 'false'
      port: 8001, // default -> 8081
    }),
  ],
})
