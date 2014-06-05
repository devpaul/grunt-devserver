var Config = require('../../../../lib/model/config/HttpConfig.js')
  , serverTypes = require('../../../../lib/model/data/serverTypes.json')
  , configTestHelper = require('./configTestHelper')

describe('HttpConfigTest', function() {
    describe('construction', function() {
        it('is constructed correctly with defaults', function() {
            var config = new Config()
            assertProperlyConstructed(config)
        })

        it('is prototyped correctly', function() {
            expect(Config.DEFAULT).to.exist
            expect(Config.DEFAULT.port).to.be.equal(8888)
            expect(Config.DEFAULT.folder).to.be.equal(process.cwd())
            expect(Config.DEFAULT.cacheControl).to.be.equal('no-cache')
        })

        function assertProperlyConstructed(config) {
            configTestHelper.expectedConfigurationOptions(config)
            expect(config).to.exist
            expect(config).to.be.an.instanceof(Config)
            expect(config.type).to.be.equal(serverTypes.HTTP)
            expect(config.port).to.be.equal(Config.DEFAULT.port)
            expect(config.port).to.be.equal(Config.DEFAULT.port)
            expect(config.folder).to.be.equal(Config.DEFAULT.folder)
            expect(config.cacheControl).to.be.equal(Config.DEFAULT.cacheControl)
        }
    })
});