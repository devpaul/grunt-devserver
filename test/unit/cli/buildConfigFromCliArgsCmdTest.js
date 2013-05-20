var buildConfigFromCliArgsCmd = require('../../../lib/cli/buildConfigFromCliArgsCmd.js')
  , HttpConfig = require('../../../lib/model/HttpConfig.js')

describe('buildConfigFromCliArgsCmdTest', function() {
    it('defaults the server port when one is not provided', function() {
        var config = buildConfigFromCliArgsCmd()

        expect(config.port).to.be.equal(HttpConfig.DEFAULT_PORT)
    })

    it('uses the server port from cli', function() {
        var expected = 2468
          , args = ('--port ' + expected).split(' ')
          , config = buildConfigFromCliArgsCmd(args)

        expect(config.port).to.be.equal(expected)
    })

    it('defaults the folder when one is not provided', function() {
        var config = buildConfigFromCliArgsCmd()

        expect(config.folder).to.be.equal(HttpConfig.DEFAULT_FOLDER)
    })

    it('uses the folder from cli', function() {
        var expected = '../'
          , args = ('--folder ' + expected).split(' ')
          , config = buildConfigFromCliArgsCmd(args)

        expect(config.folder).to.be.equal(expected)
    })

    it('uses the cache method from cli', function() {
        var expected = 'potato'
          , args = ('--cache ' + expected).split(' ')
          , config = buildConfigFromCliArgsCmd(args)

        expect(config.cacheControl).to.be.equal(expected)
    })

    it('defaults the cache method when one is not provided', function() {
        var config = buildConfigFromCliArgsCmd()

        expect(config.cacheControl).to.be.equal(HttpConfig.DEFAULT_CACHE_CONTROL)
    })
})