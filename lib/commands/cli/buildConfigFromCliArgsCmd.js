var optimist = require('optimist')
  , Config = require('../../Config.js')

function buildConfigFromCliArgsCmd(args) {
    var o = args ? optimist(args) : optimist
    return o.default('port', Config.DEFAULT_PORT)
            .default('folder', Config.DEFAULT_FOLDER)
            .alias('p', 'port')
            .alias('f', 'folder')
            .argv
}

module.exports = buildConfigFromCliArgsCmd