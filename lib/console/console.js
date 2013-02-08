var server = require('../server.js')

function getArgs() {
    var o = require('optimist')
    return o.default('port', 8888)
            .default('folder', __dirname)
            .alias('p', 'port')
            .alias('f', 'folder')
            .argv
}

server(getArgs())