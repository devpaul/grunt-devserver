var Server = require('../../Server.js')
  , buildConfigFromCliArgsCmd = require('./buildConfigFromCliArgsCmd.js')


function startFromConsoleCmd() {
    var server = new Server(buildConfigFromCliArgsCmd())
    server.start()
}

module.exports = startFromConsoleCmd;