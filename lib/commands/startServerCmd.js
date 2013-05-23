var Server = require('../controller/Server.js')
  , buildConfigFromOptions = require('./buildConfigFromOptionsCmd.js')

function startServerCmd(options) {
    var promise = buildConfigFromOptions(options)
    return promise.then(onConfigAvailable)
}

function onConfigAvailable(config) {
    var server = new Server(config)
    server.start()
}

module.exports = startServerCmd