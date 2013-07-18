var Q = require('q')
  , Server = require('../controller/Server.js')
  , buildConfigFromOptions = require('./buildConfigFromOptionsCmd.js')

function startServerCmd(options) {
    var deferred = Q.defer()
      , configPromise = buildConfigFromOptions(options)

    configPromise.then(onConfigAvailable)
    return deferred.promise

    function onConfigAvailable(config) {
        var server = new Server(config)
        server.start()
        deferred.resolve(server)
    }
}

module.exports = startServerCmd