const { terser } = require('rollup-plugin-terser')
const config = require('./rollup.config')

config.output.sourcemap = false
config.plugins = [
  ...config.plugins,
  ...[
    terser()
  ]
]

module.exports = config