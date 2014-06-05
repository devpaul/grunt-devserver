var buildConfigFromOptions = require('../../../lib/commands/buildConfigFromOptionsCmd.js')
  , HttpConfig = require('../../../lib/model/config/HttpConfig.js')
  , HttpsConfig = require('../../../lib/model/config/HttpsConfig.js')
  , serverTypes = require('../../../lib/model/data/serverTypes.json')

describe('buildConfig', function() {
    function assertConfigValueSet(configKey, expected, options) {
        var promise = buildConfigFromOptions(options || {})
        return expect(promise).to.be.fulfilled
            .and.have.deep.property(configKey, expected)
    }

    it('defaults to HTTPConfig when no type is declared', function(done) {
        assertConfigValueSet('type', serverTypes.HTTP).and.notify(done)
    })

    it('uses provided options for https', function(done) {
        var expected = {}
          , options = { type : serverTypes.HTTPS
                      , httpsOptions : expected
                      }
        assertConfigValueSet('options', expected, options).and.notify(done)
    })

    it('builds a default set of https options', function(done) {
        var options = { type : serverTypes.HTTPS }
          , promise = buildConfigFromOptions(options)

        expect(promise).to.be.fulfilled
            .and.to.exist
            .and.have.property('options')
            .and.have.deep.property('options.key')
            .and.have.deep.property('options.cert')
            .and.notify(done)
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
                assertConfigValueSet('port', clazz.DEFAULT.port, options).and.notify(done)
            })

            it(type + ' overrides the server port from options', function(done) {
                var expected = 2468
                  , options = { type : type
                              , port : expected
                              , httpsOptions : {} // speeds up https case, ignored by http case
                              }
                assertConfigValueSet('port', expected, options).and.notify(done)
            })

            it(type + ' uses default folder', function(done) {
                var options = { type : type
                              , httpsOptions : {} // speeds up https case, ignored by http case
                              }
                assertConfigValueSet('folder', clazz.DEFAULT.folder, options).and.notify(done)
            })

            it(type + ' overrides the folder from options', function(done) {
                var expected = '../'
                  , options = { type : type
                              , base : expected
                              , httpsOptions : {} // speeds up https case, ignored by http case
                              }
                assertConfigValueSet('folder', expected, options).and.notify(done)
            })

            it(type + ' uses default cache method', function(done) {
                var options = { type : type
                              , httpsOptions : {} // speeds up https case, ignored by http case
                              }
                assertConfigValueSet('cacheControl', clazz.DEFAULT.cacheControl, options).and.notify(done)
            })

            it(type + ' overrides the cache method from options', function(done) {
                var expected = 'potato'
                  , options = { type : type
                              , cache : expected
                              , httpsOptions : {} // speeds up https case, ignored by http case
                              }
                assertConfigValueSet('cacheControl', expected, options).and.notify(done)
            })
        })
    })
})