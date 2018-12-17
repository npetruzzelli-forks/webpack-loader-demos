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
    DEV_SERVER_PORT: commonConfig.webServer.port.fullStyleStack,
    PATH_TO_DIST: path.resolve(
      __dirname,
      '../../../.tmp/dist/full-style-stack/'
    )
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
    'index.sass.jsx'
  )
  // Uncomment the following if for some reason you needed to use both Sass and
  // CSS
  // webpackConfig.module.rules.push(
  //   // STYLESHEETS: CSS
  //   {
  //     test: /\.css$/,
  //     use: [
  //       /**
  //        * FOR ILLUSTRATION ONLY
  //        * This is what the loader config may look like when using
  //        * style-loader. style-loader appears to force the inclusion of
  //        * source content.
  //        */
  //       // {
  //       //   loader: IS_PRODUCTION_ENV
  //       //     ? MiniCssExtractPlugin.loader
  //       //     : 'style-loader',
  //       //   options: {
  //       //     sourceMap: true,
  //       //     convertToAbsoluteUrls: IS_PRODUCTION_ENV ? undefined : true
  //       //   }
  //       // },
  //       {
  //         loader: MiniCssExtractPlugin.loader,
  //         options: {
  //           sourceMap: true
  //         }
  //       },
  //       {
  //         loader: 'css-loader',
  //         options: {
  //           sourceMap: true
  //         }
  //       },
  //       {
  //         loader: 'postcss-loader',
  //         options: {
  //           /**
  //            * {@link https://github.com/postcss/postcss-loader#plugins}
  //            * {@link https://webpack.js.org/configuration/module/#useentry}
  //            */
  //           ident: 'postcss-for-css',
  //           config: {
  //             // Path for `postcss-load-config`. Ignores the cascade.
  //             path: POSTCSS_CONFIG_PATH,
  //             ctx: {
  //               env: WP_ENV,
  //               IS_PRODUCTION_ENV: IS_PRODUCTION_ENV
  //             }
  //           },
  //           sourceMap: true
  //         }
  //       }
  //     ]
  //   }
  // )

  webpackConfig.module.rules.push(
    // STYLESHEETS: SASS
    {
      test: /\.s[ca]ss$/,
      use: [
        /**
         * FOR ILLUSTRATION ONLY
         * This is what the loader config may look like when using
         * style-loader. style-loader appears to force the inclusion of
         * source content.
         */
        // {
        //   loader: IS_PRODUCTION_ENV
        //     ? MiniCssExtractPlugin.loader
        //     : 'style-loader',
        //   options: {
        //     sourceMap: true,
        //     convertToAbsoluteUrls: IS_PRODUCTION_ENV ? undefined : true
        //   }
        // },
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
            ident: 'postcss-for-sass',
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
