var startServer = require('./startServerCmd.js')
  , loadCompleteOptions = require('./loadCompleteOptionsCmd.js')

function startFromConsoleCmd(cli) {
    if(cli.isHelpRequested())
        cli.showHelp()
    else
        runServer(cli.options)
}

function runServer(options) {
    options = loadCompleteOptions(options)
    startServer(options)
}

module.exports = startFromConsoleCmd;