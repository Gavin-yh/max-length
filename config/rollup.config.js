const typescript = require('@rollup/plugin-typescript')

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.esm.js', // package.json 中 "module": "dist/index.esm.js"
      format: 'esm', // es module 形式的包， 用来import 导入， 可以tree shaking
    }, {
      file: 'dist/index.cjs.js', // package.json 中 "main": "dist/index.cjs.js",
      format: 'cjs', // commonjs 形式的包， require 导入 
    }, {
      file: 'dist/index.min.js',
      format: 'iife',
      name: 'maxLength'
    },
    {
      file: 'docs/index.esm.js',
      format: 'esm',
    }
  ],
  plugins: [
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript")
    }),
  ],
}

module.exports = config