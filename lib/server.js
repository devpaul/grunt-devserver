var path = require('path')
  , express = require('express')

module.exports = Server

function Server(config) {
    if(!(this instanceof Server))
        return new Server(config);

    this.app = express()
    this.config = config
    registerMiddleware(this.app, config)
}

Server.prototype.start = startServer


function registerMiddleware(app, config) {
    var corsSupport = require('./middleware/corsSupport.js')
      , noCacheHeaders = require('./middleware/noCacheHeaders.js')

    app.use(express.logger())
    app.use(corsSupport)
    app.use(noCacheHeaders)
    registerStaticContent(app, config)
}

function registerStaticContent(app, config) {
    var dirOptions = { icons : true }
      , folder = path.resolve(config.folder)
    app.use(express.directory(folder, dirOptions))
    app.use(express.static(folder))
}

function startServer() {
    var port = this.config.port

    console.log('starting server on ' + port)
    this.app.listen(port, function() {
        console.log('listening on ' + port)
    })
}