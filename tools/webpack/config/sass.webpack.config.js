const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const baseWebpackConfig = require('./base-webpack-config')
const baseWebpackVars = require('./base-webpack-vars')
const commonConfig = require('../../common-config.json')

/**
 * @param {String} [cliEnvironment]
 * @param {Object} argv
 * @return {Object}
 *
 * @see Webpack: [Configuration as a Function]{@link https://webpack.js.org/configuration/configuration-types/#exporting-a-function}
 */
function makeWebpackConfig(cliEnvironment, argv) {
  const vars = Object.assign({}, baseWebpackVars, {
    DEV_SERVER_PORT: commonConfig.webServer.port.sass,
    PATH_TO_DIST: path.resolve(__dirname, '../../../.tmp/dist/sass-stack/')
  })
  const { ENTRY_NAME, PATH_TO_SOURCE } = vars
  const webpackConfig = baseWebpackConfig(cliEnvironment, argv, vars)

  webpackConfig.entry[ENTRY_NAME] = path.resolve(
    PATH_TO_SOURCE,
    'index.sass.jsx'
  )
  webpackConfig.module.rules.push(
    // STYLESHEETS: SASS
    {
      test: /\.s[ca]ss$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    }
  )

  return webpackConfig
}

module.exports = makeWebpackConfig
