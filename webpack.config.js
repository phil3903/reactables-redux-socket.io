'use strict'

const path = require('path')
const webpack = require('webpack')
const PROJECT_ROOT = path.resolve(__dirname)

module.exports = () => {
  return {
    devtool: 'eval',
    context: path.join(PROJECT_ROOT, 'client'),
    entry: {
      client: [
        'babel-polyfill',
        'webpack-hot-middleware/client.js?reload=true',
        './client.js'
      ]
    },
    output: {
      path: PROJECT_ROOT,
      filename: 'bundle.js',
      publicPath: 'http://localhost:8080/'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [
            path.join(PROJECT_ROOT, 'client'),
            path.join(PROJECT_ROOT, 'lib'),
          ],
          query:{
            presets: [["es2015", {modules: false}], 'react', 'stage-0']
          }
        }
      ]
    }
  }
}
