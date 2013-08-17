var startServer = require('./startServerCmd.js')
  , Cli = require('../controller/Cli.js')
  , BasicOptions = require('../model/BasicOptions.js')
  , loadCompleteOptions = require('./loadCompleteOptionsCmd.js')

function startFromConsoleCmd(cli) {
    cli = cli || new Cli()
    if(cli.isHelpRequested())
        cli.showHelp()
    else
        runServer(cli.options)
}

function runServer(args) {
    var options = loadCompleteOptions(args)
      , servers = (new BasicOptions(args)).servers

    if(servers.length === 0)
        startNoConfigurationDefined(options)
    else
        startConfigurations(options, servers)
}

function startConfigurations(options, servers) {
    servers.forEach(function(servername) {
        if(!options.hasConfiguration(servername))
            throw new Error('server configuration "' + servername + '" does not exist!')
        startServer(options.getOptions(servername))
    })
}

function startNoConfigurationDefined(options) {
    var configNames = options.getConfigurationNames()

    if(configNames.length === 0)
        startServer(options.getOptions())
    else
        startConfigurations(options, configNames)
}

module.exports = startFromConsoleCmd;