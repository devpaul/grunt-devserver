var Config = require('../../../../lib/model/config/HttpsConfig.js')
  , serverTypes = require('../../../../lib/model/data/serverTypes.json')
  , configTestHelper = require('./configTestHelper')

describe('HttpsConfigTest', function() {
    describe('construction', function() {
        it('throws when constructed without options', function() {
            expect(function() {
                new Config()
            }).to.throw(Error)
        })

        it('persists options when provided', function() {
            var expectedOptions = { 'key' : 'test'
                                  , 'cert' : 'cert'
                                  }
            var config = new Config(expectedOptions)
            assertProperlyConstructed(config, expectedOptions)
        })

        it('is prototyped correctly', function() {
            expect(Config.DEFAULT.port).to.be.equal(8443)
            expect(Config.DEFAULT.folder).to.be.equal(process.cwd())
            expect(Config.DEFAULT.cacheControl).to.be.equal('no-cache')
        })

        function assertProperlyConstructed(config, expectedOptions) {
            configTestHelper.expectedConfigurationOptions(config)
            expect(config).to.exist
            expect(config).to.be.an.instanceof(Config)
            expect(config.type).to.be.equal(serverTypes.HTTPS)
            expect(config.port).to.be.equal(Config.DEFAULT.port)
            expect(config.folder).to.be.equal(Config.DEFAULT.folder)
            expect(config.cacheControl).to.be.equal(Config.DEFAULT.cacheControl)
            expect(config.options).to.deep.equal(expectedOptions)
        }
    })
});