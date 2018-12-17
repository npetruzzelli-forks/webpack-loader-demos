const path = require('path')
const commonConfig = require('../../common-config.json')

const VARS = {
  DEV_SERVER_HOSTNAME: commonConfig.webServer.hostname || 'localhost',
  DEV_SERVER_PATHNAME: commonConfig.webServer.pathname || '/',
  DEV_SERVER_PORT: 8080,
  DEV_SOURCE_PORT: commonConfig.sourcesProxyServer.http.port || 3000,
  ENTRY_NAME: 'main',
  PATH_TO_DIST: path.resolve(__dirname, '../../../.tmp/dist/'),
  PATH_TO_PUBLIC: path.resolve(__dirname, '../../../static/'),
  PATH_TO_REPO_ROOT: path.resolve(__dirname, '../../../'),
  PATH_TO_SOURCE: path.resolve(__dirname, '../../../src/'),
  POSTCSS_CONFIG_PATH: path.resolve(__dirname, '../../postcss/')
}

// .............................................................................
// THE BELOW ITEMS SHOULD NOT BE EXTENDED OR OTHERWISE MODIFIED OUTSIDE OF THIS
// FILE. MODIFICATIONS WITH THIS FILE ARE ALLOWED AS LONG AS THEY HAPPEN BEFORE
// THE NEXT SECTION.
VARS.DEVELOPMENT = 'development'
VARS.PRODUCTION = 'production'
VARS.TEST = 'test'

// .............................................................................
// THE BELOW ITEMS SHOULD NOT BE EXTENDED OR OTHERWISE MODIFIED, INCLUDING FROM
// WITHIN THIS FILE.

/**
 * The effective environment to be used by the configuration. If `NODE_ENV`
 * has not been correctly set, it will fall back to `DEVELOPMENT`.
 */
VARS.NODE_ENV = process.env.NODE_ENV
VARS.WP_ENV = VARS.NODE_ENV || VARS.DEVELOPMENT
VARS.IS_DEVELOPMENT_ENV = VARS.WP_ENV === VARS.DEVELOPMENT
VARS.IS_PRODUCTION_ENV = VARS.WP_ENV === VARS.PRODUCTION
VARS.IS_TEST_ENV = VARS.WP_ENV === VARS.TEST

module.exports = VARS
