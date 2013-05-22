var http = require('http')
  , https = require('https')
  , serverTypes = require('../model/data/serverTypes.json')

function createServerCmd(config, app) {
    assertDependencies(config)
    if(config.type === serverTypes.HTTPS)
        return createHttpsServer(config, app)
    return createHttpServer(app)
}

function createHttpsServer(config, app) {
    return https.createServer(config.options, app)
}

function createHttpServer(app) {
    return http.createServer(app)
}

function assertDependencies(config) {
    if(!config)
        throw new Error('server configuration required')
    if(config.type && !serverTypes[config.type.toUpperCase()])
        throw new Error('unrecognized server type')
}

module.exports = createServerCmd