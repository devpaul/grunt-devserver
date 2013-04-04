var optimist = require('optimist')
  , Config = require('../Config.js')

function buildConfigFromCliArgsCmd(args) {
    var config = new Config()
    args = getCLIArguments(args)
    config.port = args.port || config.port
    config.folder = args.folder || config.folder
    config.cacheControl = args.cache || config.cacheControl
    return config
}

function getCLIArguments(args) {
    var o = args ? optimist(args) : optimist
    return o.describe('port', 'listens on this port. Default: ' + Config.DEFAULT_PORT)
        .describe('folder', 'serves content from this folder. Default: ' + Config.DEFAULT_FOLDER)
        .describe('cache', 'caching method used. Default: ' + Config.DEFAULT_CACHE_CONTROL)
        .alias('p', 'port')
        .alias('f', 'folder')
        .argv
}

module.exports = buildConfigFromCliArgsCmd