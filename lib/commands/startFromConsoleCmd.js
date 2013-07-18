var startServer = require('./startServerCmd.js')
  , loadCompleteOptions = require('./loadCompleteOptionsCmd.js')
  , Cli = require('../controller/Cli.js')

function startFromConsoleCmd(cli) {
    cli = cli || new Cli()
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