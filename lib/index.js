var startServer = require('./commands/startServerCmd.js')
  , loadCompleteOptions = require('./commands/loadCompleteOptionsCmd.js')

function devserver(options) {
    options = loadCompleteOptions(options) || {}
    return startServer(options)
}

devserver.Server = require('./controller/Server.js')
devserver.HttpConfig = require('./model/HttpConfig.js')
devserver.HttpsConfig = require('./model/HttpsConfig.js')

module.exports = devserver