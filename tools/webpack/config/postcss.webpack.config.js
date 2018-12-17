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
    DEV_SERVER_PORT: commonConfig.webServer.port.postcss,
    PATH_TO_DIST: path.resolve(__dirname, '../../../.tmp/dist/postcss-stack/')
  })
  const {
    ENTRY_NAME,
    IS_PRODUCTION_ENV,
    PATH_TO_SOURCE,
    POSTCSS_CONFIG_PATH,
    WP_ENV
  } = vars
  const webpackConfig = baseWebpackConfig(cliEnvironment, argv, vars)

  webpackConfig.entry[ENTRY_NAME] = path.resolve(
    PATH_TO_SOURCE,
    'index.css.jsx'
  )
  webpackConfig.module.rules.push(
    // STYLESHEETS: CSS
    {
      test: /\.css$/,
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
          loader: 'postcss-loader',
          options: {
            /**
             * {@link https://github.com/postcss/postcss-loader#plugins}
             * {@link https://webpack.js.org/configuration/module/#useentry}
             */
            ident: 'postcss-for-css',
            config: {
              // Path for `postcss-load-config`. Ignores the cascade.
              path: POSTCSS_CONFIG_PATH,
              ctx: {
                env: WP_ENV,
                IS_PRODUCTION_ENV: IS_PRODUCTION_ENV
              }
            },
            sourceMap: true
          }
        }
      ]
    }
  )

  return webpackConfig
}

module.exports = makeWebpackConfig
