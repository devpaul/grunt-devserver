var path = require('path')
  , express = require('express')
  , corsSupport = require('../middleware/corsSupport.js')
  , noCacheHeaders = require('../middleware/noCacheHeaders.js')


/**
 * Given a server configuration create an express application server
 * and register the appropriate middleware
 *
 * @param {(HttpConfig|HttpsConfig)} config
 * @returns {function} a http/https middleware listener
 */
function createExpressMiddlewareCmd(config) {
    var app = express()
    registerMiddleware(app, config)
    return app;
}

function registerMiddleware(app, config) {
    app.use(express.logger())
    app.use(corsSupport())
    app.use(noCacheHeaders(config.cacheControl))
    registerStaticContent(app, config)
}

function registerStaticContent(app, config) {
    var dirOptions = { icons : true }
      , folder = path.resolve(config.folder)

    app.use(express.static(folder))
    app.use(express.directory(folder, dirOptions))
}

module.exports = createExpressMiddlewareCmd