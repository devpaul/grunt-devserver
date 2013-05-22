var createMiddleware = require('../commands/createMiddlewareCmd.js')
  , createServer = require('../commands/createServerCmd.js')

module.exports = Server
Server.prototype.start = startServer
Server.prototype.stop = stopServer


function Server(config, server, app) {
    assertRequirements(config)
    this.config = config
    this.app = app || createMiddleware(config)
    this.httpServer = server || createServer(config, this.app)
}

function assertRequirements(config) {
    if(!config)
        throw new Error('server configuration must be present')
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