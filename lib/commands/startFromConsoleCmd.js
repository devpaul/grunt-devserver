var startServer = require('./startServerCmd.js')

function startFromConsoleCmd(cli) {
    if(cli.isHelpRequested())
        cli.showHelp()
    else
        startServer(cli.options)
}

module.exports = startFromConsoleCmd;