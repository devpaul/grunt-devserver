var parseCliArgumentsCmd = require('../../../../lib/commands/cli/parseCliArgumentsCmd.js')
  , HttpConfig = require('../../../../lib/model/HttpConfig.js')

describe('parseCliArgumentsCmdTest', function() {
    it('does not default optional values', function() {
        assertUndefinedConfigValue('type')
        assertUndefinedConfigValue('port')
        assertUndefinedConfigValue('cache')
        assertUndefinedConfigValue('base')
    })

    function assertUndefinedConfigValue(key) {
        var config = parseCliArgumentsCmd()
        expect(config[key]).to.be.undefined
    }

    function assertConfigValueSet(argName, expected, configKey) {
        var args = argName + ' ' + expected
          , config = parseCliArgumentsCmd(args.split(' '))

        expect(config[configKey]).to.be.equal(expected)
    }

    it('uses the server port from cli', function() {
        assertConfigValueSet('--port', 2468, 'port')
        assertConfigValueSet('-p', 1234, 'port')
    })

    it('uses the folder from cli', function() {
        assertConfigValueSet('--base', 'fTest', 'base')
        assertConfigValueSet('--folder', 'folderTest', 'base')
        assertConfigValueSet('-f', 'fTest', 'base')
    })

    it('uses the cache method from cli', function() {
        assertConfigValueSet('--cache', 'potato', 'cache')
    })

    it('uses the type method from cli', function() {
        assertConfigValueSet('--type', 'https', 'type')
        assertConfigValueSet('-t', 'http', 'type')
    })

    describe('help', function() {
        var consoleLogSpy

        beforeEach(function() {
            consoleLogSpy = sinon.spy(console, 'log')
        })

        afterEach(function() {
            consoleLogSpy.reset()
        })
        it('displays help', function() {
            var config = parseCliArgumentsCmd(['--help'])

            expect(config).to.be.undefined
            expect(consoleLogSpy.calledOnce).to.be.true
        })
    })
})