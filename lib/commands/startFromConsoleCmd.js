var startServer = require('./startServerCmd.js')
  , Cli = require('../controller/Cli.js')
  , Config = require('../model/Config.js')

function startFromConsoleCmd(cli) {
    cli = cli || new Cli()
    if(cli.isHelpRequested())
        cli.showHelp()
    else
        runServer(cli.options)
}

function runServer(args) {
    var config = new Config(args)
      , servers = config.getActiveServers()

    servers.forEach(function(options) {
        startServer(options)
    })
}

module.exports = startFromConsoleCmd;