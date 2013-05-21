var buildConfigFromOptions = require('../../../lib/commands/buildConfigFromOptionsCmd.js')
  , HttpConfig = require('../../../lib/model/HttpConfig.js')
  , HttpsConfig = require('../../../lib/model/HttpsConfig.js')
  , serverTypes = require('../../../lib/model/data/serverTypes.json')

describe('buildConfig', function() {
    function assertConfigValueSet(configKey, expected, options) {
        var config = buildConfigFromOptions(options || {})
        expect(config[configKey]).to.deep.equal(expected)
        return config
    }

    it('defaults to HTTPConfig when no type is declared', function() {
        assertConfigValueSet('type', serverTypes.HTTP)
    })

    it('uses provided options for https', function() {
        var expected = {}
          , options = { type : serverTypes.HTTPS
                      , config : expected
                      }
        assertConfigValueSet('options', expected, options)
    })

    it('builds a default set of https options', function() {
        var expected = {}
          , options = { type : serverTypes.HTTPS }
        assertConfigValueSet('options', expected, options)
    })

    describe('commonConfig tests', function() {
        var TYPES = [ [HttpConfig, serverTypes.HTTP]
                    , [HttpsConfig, serverTypes.HTTPS]
                    ]

        TYPES.forEach(function(value) {
            var clazz = value[0]
              , type = value[1]

            it(type + ' uses default server port', function() {
                var options = { type : type }
                assertConfigValueSet('port', clazz.DEFAULT_PORT, options)
            })

            it(type + ' overrides the server port from options', function() {
                var expected = 2468
                  , options = { type : type
                              , port : expected
                              }
                assertConfigValueSet('port', expected, options)
            })

            it(type + ' uses default folder', function() {
                var options = { type : type }
                assertConfigValueSet('folder', clazz.DEFAULT_FOLDER, options)
            })

            it(type + ' overrides the folder from options', function() {
                var expected = '../'
                  , options = { type : type
                              , base : expected
                              }
                assertConfigValueSet('folder', expected, options)
            })

            it(type + ' uses default cache method', function() {
                var options = { type : type }
                assertConfigValueSet('cacheControl', clazz.DEFAULT_CACHE_CONTROL, options)
            })

            it(type + ' overrides the cache method from options', function() {
                var expected = 'potato'
                  , options = { type : type
                              , cache : expected
                              }
                assertConfigValueSet('cacheControl', expected, options)
            })
        })
    })
})