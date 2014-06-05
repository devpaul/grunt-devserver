var startServer = require('./commands/startServerCmd.js')
  , loadCompleteOptions = require('./commands/loadCompleteOptionsCmd.js')

function devserver(options) {
    options = options ? loadCompleteOptions(options).getOptions() : {}
    return startServer(options)
}

devserver.Server = require('./controller/Server.js')
devserver.HttpConfig = require('./model/config/HttpConfig.js')
devserver.HttpsConfig = require('./model/config/HttpsConfig.js')
devserver.BasicOptions = require('./model/BasicOptions.js')
devserver.MultiOptions = require('./model/MultiOptions.js')
devserver.CompositeOptions = require('./model/CompositeOptions.js')

module.exports = devserver