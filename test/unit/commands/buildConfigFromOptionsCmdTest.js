var buildConfigFromOptions = require('../../../lib/commands/buildConfigFromOptionsCmd.js')
  , HttpConfig = require('../../../lib/model/HttpConfig.js')
  , serverTypes = require('../../../lib/model/data/serverTypes.json')

describe('buildConfig', function() {
    function assertConfigValueSet(configKey, expected, options) {
        var config = buildConfigFromOptions(options || {})
        expect(config[configKey]).to.be.equal(expected)
        return config
    }

    it('defaults the server port when one is not provided', function() {
        assertConfigValueSet('port', HttpConfig.DEFAULT_PORT)
    })

    it('configures the server port number from grunt', function() {
        var expected = 2468
        assertConfigValueSet('port', expected, { port : expected })
    })

    it('defaults the folder when one is not provided', function() {
        assertConfigValueSet('folder', HttpConfig.DEFAULT_FOLDER)
    })

    it('configures the folder from grunt', function() {
        var expected = '../'
        assertConfigValueSet('folder', expected, { base : expected})
    })

    it('defaults to cache method when one is not provided', function() {
        assertConfigValueSet('cacheControl', HttpConfig.DEFAULT_CACHE_CONTROL)
    })

    it('configures the cache method from grunt', function() {
        var expected = 'potato'
        assertConfigValueSet('cacheControl', expected, { cache : expected})
    })

    it('defaults to HTTPConfig when no type is declared', function() {
        assertConfigValueSet('type', serverTypes.HTTP)
    })

    it('recognizes the http server type', function() {
        var expected = serverTypes.HTTP

        assertConfigValueSet('type', expected)
    })

    it('recognizes the https server type', function() {
        var expected = serverTypes.HTTPS

        assertConfigValueSet('type', expected, { type : expected })
    })
})