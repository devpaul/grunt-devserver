var serverTypes = require('./../data/serverTypes.json')
  , underscore = require('underscore')
  , CommonConfig = require('./CommonConfig')

/**
 * Configuration for a HTTPS server
 * @param options
 * @constructor
 */
function HttpsConfig(options) {
    underscore.extend(this, HttpsConfig.DEFAULT)
    this.type = serverTypes.HTTPS
    if(options)
        this.options = options

    if(!options)
        throw new Error('ssl options are required for https configs')
}

HttpsConfig.DEFAULT = { port: 8443
                      , folder: process.cwd()
                      , cacheControl: 'no-cache'
                      , middleware: CommonConfig.defaultMiddleware
                      }

module.exports = HttpsConfig