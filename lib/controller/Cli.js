var optimist = require('optimist')
  , HttpConfig = require('../model/HttpConfig.js')
  , proto = Cli.prototype

proto.isHelpRequested = isHelpRequested
proto.showHelp = showHelp

module.exports = Cli

function Cli(args) {
    this.options = initOptimist(args).argv
}

function initOptimist(args) {
    var o = args ? optimist(args) : optimist
        , portOptions = { describe: 'overrides the default port'
                        , alias: 'p'
                        }
        , baseOptions = { describe: 'serves content from this folder. Default: ' + HttpConfig.DEFAULT_FOLDER
                        , alias: ['folder', 'f']
                        }
        , cacheOptions = { describe: 'caching method used. Default: ' + HttpConfig.DEFAULT_CACHE_CONTROL }
        , typeOptions = { describe: 'server type http|https'
                        , alias: 't'
                        }
        , helpOptions = { describe: 'displays this help message'
                        , alias: '?'
                        }
        , serverOptions = { describe: 'starts a server using the prescribed server configuration'
                          , alias: 's'
                          }
    return o.options('port', portOptions)
            .options('base', baseOptions)
            .options('cache', cacheOptions)
            .options('type', typeOptions)
            .options('server', serverOptions)
            .options('help', helpOptions)
}

function isHelpRequested() {
    return !!this.options.help
}

function showHelp(buffer) {
    if(!buffer)
        buffer = console.log
    initOptimist().showHelp(buffer)
}