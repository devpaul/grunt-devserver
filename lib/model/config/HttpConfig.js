var serverTypes = require('./../data/serverTypes.json')
  , underscore = require('underscore')
  , CommonConfig = require('./CommonConfig')

/**
 * Configuration for a HTTP server
 * @constructor
 */
function HttpConfig() {
    underscore.extend(this, HttpConfig.DEFAULT);
    this.type = serverTypes.HTTP;
}

HttpConfig.DEFAULT = { port: 8888
                     , folder: process.cwd()
                     , cacheControl: 'no-cache'
                     , middleware: CommonConfig.defaultMiddleware
                     }

module.exports = HttpConfig