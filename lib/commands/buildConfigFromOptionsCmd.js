var HttpConfig = require('../model/HttpConfig.js')
  , HttpsConfig = require('../model/HttpsConfig.js')
  , serverTypes = require('../model/data/serverTypes.json')

function buildConfigFromOptionsCmd(options) {
    if(!options.type || options.type === serverTypes.HTTP)
        return buildHttpConfig(options)
    if(options.type === serverTypes.HTTPS)
        return buildHttpsConfig(options)
}

function buildHttpsConfig(options) {
    var config = new HttpsConfig(options)
    commonConfig(options, config)
    return config;
}

function buildHttpConfig(options) {
    var config = new HttpConfig()
    commonConfig(options, config)
    return config
}

function commonConfig(options, config) {
    if(options.port)
        config.port = options.port
    if(options.base)
        config.folder = options.base
    if(options.cache)
        config.cacheControl = options.cache
}

module.exports = buildConfigFromOptionsCmd