/**
 * Used to configure options for SourceMapDevToolPlugin
 */
function moduleFilenameTemplate(info, isFallback) {
  let template = info.resourcePath
  let querystring = []
  if (info.namespace === 'string' && info.namespace.length > 0) {
    querystring.push('namespace=' + info.namespace)
  }
  if (isFallback === true) {
    querystring.push('hash=' + info.hash)
  }
  if (querystring.length > 0) {
    // This only works as expected if the URL doesn't already contain a
    // querystring.
    template += '?' + querystring.join('&')
  }
  return template
}

module.exports = moduleFilenameTemplate
