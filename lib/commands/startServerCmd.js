var HttpConfig = require('../model/config/HttpConfig.js')
  , HttpsConfig = require('../model/config/HttpsConfig.js')
  , serverTypes = require('../model/data/serverTypes.json')
  , buildServer = require('./buildServerCmd.js')
  , Q = require('q')

function startServerCmd(options) {
    var config = buildConfigFromOptions(options)
      , serverPromise = buildServer(config)
      , startDeferred = Q.defer()

    serverPromise.then(function (server) {
        server.start()
        startDeferred.resolve(server)
    }).fail(startDeferred.reject)

    return startDeferred.promise
}

function buildConfigFromOptions(options) {
    if(!options.type || options.type === serverTypes.HTTP)
        return new HttpConfig(options)
    else if(options.type === serverTypes.HTTPS)
        return new HttpsConfig(options)
}

module.exports = startServerCmd