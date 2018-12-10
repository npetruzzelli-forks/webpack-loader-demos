const autoprefixer = require('autoprefixer')
module.exports = function(context) {
  // const LOADER = context.webpack
  /**
   * @see Docs: [PostCSS and Source Maps]{@link https://github.com/postcss/postcss/blob/master/docs/source-maps.md}
   */
  const POSTCSS_CONFIG = {
    /**
     * > Custom PostCSS Parser
     *
     * @type {String|Function}
     */
    // parser: undefined,
    /**
     * > Custom PostCSS Syntax
     *
     * @type {String|Function}
     */
    // syntax: undefined,
    /**
     * > Custom PostCSS Stringifier
     *
     * @type {String|Function}
     */
    // stringifier: undefined,
  }
  const IS_PRODUCTION_ENV = context.IS_PRODUCTION_ENV

  POSTCSS_CONFIG.plugins = [
    autoprefixer({
      /**
       * The `browsers` option is intentionally not set to allow for the
       * use of a `browserslist` config file.
       *
       * > The best practice is to use `.browserslistrc` config or
       * > browserslist key in package.json to share target browsers with
       * > Babel, ESLint and Stylelint.
       * @see {@link https://github.com/postcss/autoprefixer#options}
       *
       * @see {@link https://github.com/postcss/autoprefixer#browsers}
       * @see {@link https://github.com/ai/browserslist}
       */
      // browsers: []
    })
  ]

  if (IS_PRODUCTION_ENV) {
    POSTCSS_CONFIG.map = false
  } else {
    POSTCSS_CONFIG.map = {
      /**
       * > Indicates that PostCSS should add annotation comments to the
       * > CSS. By default, PostCSS will always add a comment with a path
       * > to the source map. PostCSS will not add annotations to CSS
       * > files that do not contain any comments.
       * >
       * > By default, PostCSS presumes that you want to save the source
       * > map as opts.to + '.map' and will use this path in the
       * > annotation comment. A different path can be set by providing a
       * > string value for annotation.
       * >
       * > If you have set inline: true, annotation cannot be disabled.
       *
       * @type {Boolean|String}
       */
      annotation: false,

      /**
       * > By default, PostCSS will set the sources property of the map to
       * > the value of the from option. If you want to override this
       * > behaviour, you can use map.from to explicitly set the source
       * > map's sources property. Path should be absolute or relative
       * > from generated file (to option in process() method).
       *
       * @type {String}
       */
      // from: '',

      /**
       * > Indicates that the source map should be embedded in the output
       * > CSS as a Base64-encoded comment. By default, it is true. But if
       * > all previous maps are external, not inline, PostCSS will not
       * > embed the map even if you do not set this option.
       *
       * @type {Boolean}
       */
      inline: false,

      /**
       * > Source map content from a previous processing step (for
       * > example, Sass compilation). PostCSS will try to read the
       * > previous source map automatically (based on comments within the
       * > source CSS), but you can use this option to identify it
       * > manually. If desired, you can omit the previous map with prev:
       * > false.
       *
       * Setting `prev` has no effect when using the postcss-loader for
       * webpack as it handles this automatically.
       *
       * @type {String|Object|Boolean|Function}
       */
      // prev: {},

      /**
       * > Indicates that PostCSS should set the origin content (for
       * > example, Sass source) of the source map. By default, it is
       * > true. But if all previous maps do not contain sources content,
       * > PostCSS will also leave it out even if you do not set this
       * > option.
       *
       * @type {Boolean}
       */
      sourcesContent: true
    }
  }

  return POSTCSS_CONFIG
}
