var buildConfigFromOptions = require('../../../lib/commands/buildConfigFromOptionsCmd.js')
  , HttpConfig = require('../../../lib/model/HttpConfig.js')
  , HttpsConfig = require('../../../lib/model/HttpsConfig.js')
  , serverTypes = require('../../../lib/model/data/serverTypes.json')

describe('buildConfig', function() {
    function assertConfigValueSet(configKey, expected, options) {
        var promise = buildConfigFromOptions(options || {})
        return promise.then(function(config) {
            expect(config[configKey]).to.deep.equal(expected)
        })
    }

    function completeTestOnPromise(promise, done) {
        promise.then(function() {
            done()
        }, function(err) {
            done(err)
        })
    }

    it('defaults to HTTPConfig when no type is declared', function(done) {
        var promise = assertConfigValueSet('type', serverTypes.HTTP)
        completeTestOnPromise(promise, done)
    })

    it('uses provided options for https', function(done) {
        var expected = {}
          , options = { type : serverTypes.HTTPS
                      , httpsOptions : expected
                      }
          , promise = assertConfigValueSet('options', expected, options)
        completeTestOnPromise(promise, done)
    })

    it('builds a default set of https options', function(done) {
        var options = { type : serverTypes.HTTPS }
          , promise = buildConfigFromOptions(options)

        promise.then(function(config) {
            expect(config).to.exist
            expect(config.key).to.exist
            expect(config.cert).to.exist
            done()
        })
        completeTestOnPromise(promise, done)
    })

    describe('commonConfig tests', function() {
        var TYPES = [ [HttpConfig, serverTypes.HTTP]
                    , [HttpsConfig, serverTypes.HTTPS]
                    ]

        TYPES.forEach(function(value) {
            var clazz = value[0]
              , type = value[1]

            it(type + ' uses default server port', function(done) {
                var options = { type : type
                              , httpsOptions : {} // speeds up https case, ignored by http case
                              }
                  , promise = assertConfigValueSet('port', clazz.DEFAULT_PORT, options)
                completeTestOnPromise(promise, done)
            })

            it(type + ' overrides the server port from options', function(done) {
                var expected = 2468
                  , options = { type : type
                              , port : expected
                              , httpsOptions : {} // speeds up https case, ignored by http case
                              }
                  , promise = assertConfigValueSet('port', expected, options)
                completeTestOnPromise(promise, done)
            })

            it(type + ' uses default folder', function(done) {
                var options = { type : type
                              , httpsOptions : {} // speeds up https case, ignored by http case
                              }
                  , promise = assertConfigValueSet('folder', clazz.DEFAULT_FOLDER, options)
                completeTestOnPromise(promise, done)
            })

            it(type + ' overrides the folder from options', function(done) {
                var expected = '../'
                  , options = { type : type
                              , base : expected
                              , httpsOptions : {} // speeds up https case, ignored by http case
                              }
                  , promise = assertConfigValueSet('folder', expected, options)
                completeTestOnPromise(promise, done)
            })

            it(type + ' uses default cache method', function(done) {
                var options = { type : type
                              , httpsOptions : {} // speeds up https case, ignored by http case
                              }
                  , promise = assertConfigValueSet('cacheControl', clazz.DEFAULT_CACHE_CONTROL, options)
                completeTestOnPromise(promise, done)
            })

            it(type + ' overrides the cache method from options', function(done) {
                var expected = 'potato'
                  , options = { type : type
                              , cache : expected
                              , httpsOptions : {} // speeds up https case, ignored by http case
                              }
                  , promise = assertConfigValueSet('cacheControl', expected, options)
                completeTestOnPromise(promise, done)
            })
        })
    })
})