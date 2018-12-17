const path = require('path')
const commonConfig = require('../../common-config.json')
const serveIndexForRoute = require('../utils/serve-index-for-route')

/**
 * FAUX_SOURCE_PATH is a path to an empty or non-existent directory. We are only
 * interested in serving specific directories at specific routes.
 * `server.baseDir` should not serve unnecessary content.
 */
const FAUX_SOURCE_PATH = path.resolve(__dirname, '../../../.tmp/faux-src')
const SOURCE_PATH = path.resolve(__dirname, '../../../src')

/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
const bsConfig = {
  ui: {
    port: commonConfig.sourcesProxyServer.ui.port
  },
  files: false,
  // watchEvents: ['change'],
  watch: false,
  // ignore: [],
  // single: false,
  // watchOptions: { ignoreInitial: true },
  server: {
    baseDir: FAUX_SOURCE_PATH,
    directory: false,
    routes: {
      '/src': SOURCE_PATH
    }
  },
  proxy: false,
  port: commonConfig.sourcesProxyServer.http.port,
  // middleware: false,
  // serveStatic: [],
  // serveStaticOptions: {},
  ghostMode: false, // Disable all ghosting
  // ghostMode [defaults]: {
  //   clicks: true,
  //   scroll: true,
  //   location: true,
  //   forms: {
  //     submit: true,
  //     inputs: true,
  //     toggles: true
  //   }
  // },
  logLevel: 'info', // "info" [default], "debug", "warn", or "silent"
  // logPrefix: 'Browsersync',
  // logConnections: false,
  // logFileChanges: true,
  // logSnippet: true,
  // rewriteRules: [],
  open: false, // true [default], "local", "external", "ui", "ui-external", "tunnel", or false
  // browser: 'default',
  // cors: false,
  // xip: false,
  // hostnameSuffix: false, // Not documented?
  // reloadOnRestart: false,
  notify: false, // true [default], false
  // scrollProportionally: true,
  // scrollThrottle: 0,
  // scrollRestoreTechnique: 'window.name',
  // scrollElements: [],
  // scrollElementMapping: [],
  // reloadDelay: 0,
  // reloadDebounce: 500,
  // reloadThrottle: 0,
  // plugins: [],
  injectChanges: false, // true [default], false
  // startPath: null,
  // minify: true,
  // host: null,
  // localOnly: false,
  codeSync: false, // true [default], false
  timestamps: true,
  clientEvents: [] // Undocumented?
  // clientEvents [defaults]: [
  //   'scroll',
  //   'scroll:element',
  //   'input:text',
  //   'input:toggles',
  //   'form:submit',
  //   'form:reset',
  //   'click'
  // ],
  // socket: {
  //   socketIoOptions: {
  //     log: false
  //   },
  //   socketIoClientConfig: {
  //     reconnectionAttempts: 50
  //   },
  //   path: '/browser-sync/socket.io',
  //   clientPath: '/browser-sync',
  //   namespace: '/browser-sync',
  //   clients: {
  //     heartbeatTimeout: 5000
  //   }
  // },
  // tagNames: { // Undocumented?
  //   less: 'link',
  //   scss: 'link',
  //   css: 'link',
  //   jpg: 'img',
  //   jpeg: 'img',
  //   png: 'img',
  //   svg: 'img',
  //   gif: 'img',
  //   js: 'script'
  // },
  // injectNotification: false // Undocumented?
}

if (!Array.isArray(bsConfig.middleware)) {
  if (bsConfig.middleware == null) {
    bsConfig.middleware = []
  } else {
    bsConfig.middleware = [bsConfig.middleware]
  }
}

if (
  typeof bsConfig.server === 'object' &&
  typeof bsConfig.server.routes === 'object'
) {
  const routes = bsConfig.server.routes
  for (const routeUrl in routes) {
    let routeFsPath = routes[routeUrl]

    bsConfig.middleware.push(serveIndexForRoute(routeUrl, routeFsPath))
  }
}

module.exports = bsConfig
