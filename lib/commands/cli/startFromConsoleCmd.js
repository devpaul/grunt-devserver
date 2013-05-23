var startServer = require('../startServerCmd.js')
  , parseCliArguments = require('./parseCliArgumentsCmd.js')

function startFromConsoleCmd() {
    var options = parseCliArguments()

    if(options)
        startServer(options)
}

module.exports = startFromConsoleCmd;