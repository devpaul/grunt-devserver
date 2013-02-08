var path = require('path')
  , express = require('express')

module.exports = Server

function Server(config) {
    var app = express()
    registerMiddleware(app, config)
    startServer(app, config.port)
}

function registerMiddleware(app, config) {
    app.use(express.logger())
    registerGlobalHeaderOptions(app)
    registerStaticContent(app, config)
}

function registerStaticContent(app, config) {
    var dirOptions = { icons : true }
      , folder = path.resolve(config.folder)
    app.use(express.directory(folder, dirOptions))
    app.use(express.static(folder))
}

function registerGlobalHeaderOptions(app) {
    app.use(function(req, res, next) {
        res.setHeader('Cache-Control', 'no-cache')
        next()
    })
}

function startServer(app, port) {
    console.log('starting server on ' + port)
    app.listen(port, function() {
        console.log('listening on ' + port)
    })
}