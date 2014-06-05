var HttpConfig = require('../model/config/HttpConfig.js')
  , HttpsConfig = require('../model/config/HttpsConfig.js')
  , serverTypes = require('../model/data/serverTypes.json')
  , pem = require('pem')
  , Q = require('q')

function buildConfigFromOptionsCmd(options) {
    var deferred = Q.defer()

    if(!options.type || options.type === serverTypes.HTTP)
        buildHttpConfig(deferred, options)
    else if(options.type === serverTypes.HTTPS)
        buildHttpsConfig(deferred, options)

    return deferred.promise
}

function buildHttpsConfig(deferred, options) {
    if(options.httpsOptions)
        buildHttpsConfigWithProvidedOptions(deferred, options, options.httpsOptions)
    else
        buildSelfSignedHttpsConfig(deferred, options)
}

function buildHttpConfig(deferred, options) {
    var config = new HttpConfig()
    commonConfig(options, config)
    deferred.resolve(config)
}

function commonConfig(options, config) {
    if(options.port)
        config.port = options.port
    if(options.base)
        config.folder = options.base
    if(options.cache)
        config.cacheControl = options.cache
}

function buildHttpsConfigWithProvidedOptions(deferred, options, httpsOptions) {
    var config = new HttpsConfig(httpsOptions)
    commonConfig(options, config)
    deferred.resolve(config)
}

function buildSelfSignedHttpsConfig(deferred, options) {
    var pemOptions = {days:7, selfSigned:true}

    console.log('creating self-signing certificates for ssl')
    pem.createCertificate(pemOptions, onCertificateCreated);

    function onCertificateCreated(err, keys) {
        var httpsOptions

        if(err)
            deferred.reject(err)
        else {
            httpsOptions = { key : keys.serviceKey
                           , cert : keys.certificate
                           }

            buildHttpsConfigWithProvidedOptions(deferred, options, httpsOptions)
        }
    }
}

module.exports = buildConfigFromOptionsCmd