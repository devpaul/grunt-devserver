var Server = require('../Server.js')
  , Config = require('../Config.js')

function getArgs() {
    var o = require('optimist')
    return o.default('port', Config.DEFAULT_PORT)
            .default('folder', Config.DEFAULT_FOLDER)
            .alias('p', 'port')
            .alias('f', 'folder')
            .argv
}

function startFromConsoleCmd() {
    var server = new Server(getArgs())

    server.start()
}

module.exports = startFromConsoleCmd;