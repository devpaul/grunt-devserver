var morgan = require('morgan')
  , corsSupport = require('../../middleware/corsSupport')
  , noCacheHeaders = require('../../middleware/noCacheHeaders')
  , serveStatic = require('serve-static')
  , serveFolder = require('serve-index')
  , path = require('path')

function CommonConfig() { }

function defaultMiddleware() {
    var absoluteFolder = path.resolve(this.folder)

    return [ morgan()
           , corsSupport()
           , noCacheHeaders(this.cacheControl)
           , serveStatic(this.folder)
           , serveFolder(absoluteFolder, { icons : true })
           ]
}

CommonConfig.defaultMiddleware = defaultMiddleware
CommonConfig.DEFAULT = { middleware: defaultMiddleware }

module.exports = CommonConfig