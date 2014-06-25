var http = require('http')
  , https = require('https')
  , serverTypes = require('../model/data/serverTypes.json')
  , Q = require('q')

/**
 *
 * @param config a HttpConfig or HttpsConfig describing the server
 * @param app an express app (or request listener)
 * @returns {Promise} a promise
 */
function createServerCmd(config, app) {
    var deferred = Q.defer()

    try {
        assertDependencies(config)
        if(config.type === serverTypes.HTTPS)
            createHttpsServer(config, app, deferred)
        else if(config.type === serverTypes.HTTP)
            deferred.resolve(createHttpServer(app))
        else
            new Error('unknown server type')
    } catch(error) {
        deferred.reject(error)
    }

    return deferred.promise
}

function createHttpsServer(config, app, deferred) {
    config.httpsOptions.then(function (httpsOptions) {
        https.createServer(httpsOptions, app)
    }).then(deferred.resolve, deferred.reject)
}

function createHttpServer(app) {
    return http.createServer(app)
}

function assertDependencies(config) {
    if(!config)
        throw new Error('server configuration required')
    if(config.type)
        throw new Error('missing server type')
}

module.exports = createServerCmd