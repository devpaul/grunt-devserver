var optimist = require('optimist')
  , HttpConfig = require('../../model/HttpConfig.js')

/**
 * @param args optional
 * @returns {undefined|object}
 */
function parseCliArgumentsCmd(args) {
    args = initOptimist(args).argv
    if(isHelpRequested(args))
        displayHelp()
    else
        return args
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
    return o.options('port', portOptions)
        .options('base', baseOptions)
        .options('cache', cacheOptions)
        .options('type', typeOptions)
        .options('help', helpOptions)
}

function isHelpRequested(args) {
    return !!args.help
}

function displayHelp() {
    initOptimist().showHelp(console.log)
}

module.exports = parseCliArgumentsCmd