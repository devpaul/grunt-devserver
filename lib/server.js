var path = require('path')
  , express = require('express')
  , http = require('http')

module.exports = Server

function Server(config) {
    if(!(this instanceof Server))
        return new Server(config);

    this.app = express()
    this.httpServer = http.createServer(this.app)
    this.config = config
    registerMiddleware(this.app, config)
}

Server.prototype.start = startServer
Server.prototype.stop = stopServer


function registerMiddleware(app, config) {
    var corsSupport = require('./middleware/corsSupport.js')
      , noCacheHeaders = require('./middleware/noCacheHeaders.js')

    app.use(express.logger())
    app.use(corsSupport)
    app.use(noCacheHeaders(config.cacheControl))
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
    this.httpServer.listen(port, onListening)

    function onListening() {
        console.log('listening on ' + port)
    }
}

function stopServer() {
    console.log('stopping server')
    this.httpServer.close()
}

