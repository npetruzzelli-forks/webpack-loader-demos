const serveIndex = require('serve-index')

var _serveDirectory = 0

/**
 * Based on, and intended to be consistent with, Browsersync's internal code for
 * serving a directory listing for `baseDir`.
 *
 * @param {String} routeUrl
 * @param {String} routeFsPath
 * @returns {Function}
 *
 * @see {@link https://github.com/BrowserSync/browser-sync/blob/d60cd916ff1c64a69fddaa5cd2ca1061f066266e/packages/browser-sync/lib/server/static-server.js#L20-L36}
 */
function serveIndexForRoute(routeUrl, routeFsPath) {
  return {
    route: routeUrl,
    handle: serveIndex(routeFsPath, {
      icons: true,
      view: 'details'
    }),
    id: `Server Route Directory Middleware for Browsersync - ${_serveDirectory++}`
  }
}

module.exports = serveIndexForRoute
