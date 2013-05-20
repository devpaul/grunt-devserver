var Config = require('../../../lib/model/HttpConfig.js')
  , serverTypes = require('../../../lib/model/data/serverTypes.json')

describe('HttpConfigTest', function() {
    describe('construction', function() {
        it('is constructed correctly with defaults', function() {
            var config = new Config()
            assertProperlyConstructed(config)
        })

        it('is prototyped correctly', function() {
            expect(Config.DEFAULT_PORT).to.be.equal(8888)
            expect(Config.DEFAULT_FOLDER).to.be.equal(process.cwd())
            expect(Config.DEFAULT_CACHE_CONTROL).to.be.equal('no-cache')
        })

        function assertProperlyConstructed(config) {
            expect(config).to.be.defined
            expect(config).to.be.an.instanceof(Config)
            expect(config.type).to.be.equal(serverTypes.HTTP)
            expect(config.port).to.be.equal(Config.DEFAULT_PORT)
            expect(config.port).to.be.equal(Config.DEFAULT_PORT)
            expect(config.folder).to.be.equal(Config.DEFAULT_FOLDER)
            expect(config.cacheControl).to.be.equal(Config.DEFAULT_CACHE_CONTROL)
        }
    })
});