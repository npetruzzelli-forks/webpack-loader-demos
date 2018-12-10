const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const moduleFilenameTemplate = require('../utils/source-map-dev-tool-template')

const { HotModuleReplacementPlugin, SourceMapDevToolPlugin } = webpack

/**
 * Per Webpack's documentation:
 * > When the webpack configuration exports a function, an "environment" may be
 * > passed to it.
 * but, we may have other scripts keying off of the NODE_ENV environment
 * variable. For our configuration, we will determine our effective environment
 * using NODE_ENV and will ignore webpack's own `--env` command line argument.
 *
 * [What is NODE_ENV ...?]{@link https://stackoverflow.com/questions/16978256/what-is-node-env-in-express/16979503#16979503}
 * [ExpressJS: Production best practices: performance and reliability]{@link https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production}
 * [Webpack: Specify the Environment]{@link https://webpack.js.org/guides/production/#specify-the-environment}
 * [Webpack: Environment Options]{@link https://webpack.js.org/api/cli/#environment-options}
 * [Webpack: Mode]{@link https://webpack.js.org/concepts/mode/}
 * [cross-env]{@link https://github.com/kentcdodds/cross-env}
 */

/**
 * @param {String} [cliEnvironment]
 * @param {Object} argv
 * @param {Object} vars - additional variables passed by the parent function.
 * @return {Object}
 *
 * @see Webpack: [Configuration as a Function]{@link https://webpack.js.org/configuration/configuration-types/#exporting-a-function}
 */
function makeBaseWebpackConfig(cliEnvironment, argv, vars) {
  const {
    DEV_SERVER_HOSTNAME,
    DEV_SERVER_PATHNAME,
    DEV_SERVER_PORT,
    DEV_SOURCE_PORT,
    DEVELOPMENT,
    IS_DEVELOPMENT_ENV,
    IS_PRODUCTION_ENV,
    IS_TEST_ENV,
    PATH_TO_DIST,
    PATH_TO_PUBLIC,
    PATH_TO_REPO_ROOT,
    PATH_TO_SOURCE,
    PRODUCTION,
    WP_ENV
  } = vars

  /**
   * Set mode based on the `NODE_ENV` environment variable, but give priority
   * to the `--mode` command line argument, if defined.
   *
   * @type {('production'|'development'|'none')}
   */
  const MODE =
    argv.mode || (WP_ENV === PRODUCTION || WP_ENV === DEVELOPMENT)
      ? WP_ENV
      : 'none'

  const miniStylesExtract = new MiniCssExtractPlugin({
    filename: '_assets/bundles/[name]/[name].bundle.[hash:20].css',
    chunkFilename: '_assets/bundles/[name]/[id].css'
  })

  var webpackConfig = {
    entry: {},
    mode: MODE,
    module: {
      rules: [
        // SCRIPTS: JavaScript & React JSX
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'babel-loader',
              options: {}
            }
          ]
        },

        // NON-SVG IMAGES
        {
          test: /\.(ani|cur|gif|ico|jpeg|jpg|png|webp)$/,
          loader: 'file-loader',
          options: {
            name: '_assets/bundles/common/images/[name].[hash:20].[ext]'
          }
        },

        // NON-SVG FONTS
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          loader: 'file-loader',
          options: {
            name: '_assets/bundles/common/fonts/[name].[hash:20].[ext]'
          }
        },

        // SVG IMAGES & FONTS
        {
          test: /\.svg$/,
          loader: 'file-loader',
          options: {
            name: function svgName(file) {
              var isFont
              var isImage
              var name

              /**
               * @todo Determine by path or file name whether the
               *       file is an SVG image or SVG font.
               */
              isImage = false
              isFont = false

              name = '_assets/bundles/common/'
              if (isImage) {
                name += 'images/'
              } else if (isFont) {
                name += 'fonts/'
              } else {
                // unknown
                name += 'svg/'
              }
              name += '[name].[hash:20].[ext]'
              return name
            }
          }
        }
      ]
    },
    resolve: { extensions: ['*', '.jsx', '.js', '.json'] },
    output: {
      path: PATH_TO_DIST,
      publicPath: '/',
      filename: '_assets/bundles/[name]/[name].[hash:20].js'
    },
    devServer: {
      contentBase: PATH_TO_PUBLIC,
      port: DEV_SERVER_PORT,
      publicPath: `http://${DEV_SERVER_HOSTNAME}:${DEV_SERVER_PORT}${DEV_SERVER_PATHNAME}`,
      historyApiFallback: true,
      proxy: {
        '/src': {
          pathRewrite: { '^/src': '' },
          target: `http://localhost:${DEV_SOURCE_PORT}`
        }
      }
    },
    plugins: []
  }

  // ...........................................................................
  // Configuration common to all environments EXCEPT the `test` environment.
  if (!IS_TEST_ENV) {
    // PLUGINS
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(PATH_TO_SOURCE, 'index.html'),
        filename: path.resolve(PATH_TO_DIST, 'index.html')
      })
    )
  }
  if (IS_PRODUCTION_ENV) {
    // .........................................................................
    // Configuration for production environment.
    // CLEAN
    let pathsToClean = [PATH_TO_DIST]
    let cleanOptions = {
      allowExternal: false,
      beforeEmit: false,
      dry: false,
      exclude: [],
      root: PATH_TO_REPO_ROOT,
      verbose: true,
      watch: false
    }
    webpackConfig.plugins.push(
      new CleanWebpackPlugin(pathsToClean, cleanOptions)
    )

    // PUBLIC FILES / STATIC FILES
    webpackConfig.plugins.push(
      new CopyWebpackPlugin([
        {
          from: PATH_TO_PUBLIC,
          to: PATH_TO_DIST,
          ignore: '**/.dirkeep'
        }
      ])
    )
  } else if (IS_DEVELOPMENT_ENV) {
    // .........................................................................
    // Configuration for development environment.
    // LIVE RELOAD
    webpackConfig.devServer.hot = true
    webpackConfig.devServer.hotOnly = false
    webpackConfig.plugins.push(new HotModuleReplacementPlugin())
  }

  // ...........................................................................
  // Configuration common to all environments.
  // STYLES
  webpackConfig.plugins.push(miniStylesExtract)

  // SOURCE MAPS
  // Use `devtool` or `SourceMapDevToolPlugin` never both. Using both will
  // create malformed Source Maps.
  webpackConfig.devtool = false
  webpackConfig.plugins.push(
    new SourceMapDevToolPlugin({
      filename: '[file].map[query]',
      noSources: true,
      moduleFilenameTemplate: info => moduleFilenameTemplate(info, false),
      fallbackModuleFilenameTemplate: info => moduleFilenameTemplate(info, true)
    })
  )

  return webpackConfig
}

module.exports = makeBaseWebpackConfig
