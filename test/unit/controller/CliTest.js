var Cli = require('../../../lib/controller/Cli.js')

describe('CliTest', function() {
    describe('construction', function() {
        it('is correctly defined', function() {
            expect(Cli.prototype).to.have.property('isHelpRequested')
            expect(Cli.prototype).to.have.property('showHelp')
        })
    })

    describe('options', function() {
        it('does not default optional values', function() {
            assertUndefinedConfigValue('type')
            assertUndefinedConfigValue('port')
            assertUndefinedConfigValue('cache')
            assertUndefinedConfigValue('base')
        })

        function assertUndefinedConfigValue(key) {
            var cli = new Cli()
            expect(cli.options[key]).to.be.undefined
        }

        function assertConfigValueSet(argName, expected, configKey) {
            var args = argName + ' ' + expected
              , cli = new Cli(args.split(' '))

            expect(cli.options[configKey]).to.be.equal(expected)
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
    })

    describe('isHelpRequested', function() {
        it('returns true when help is requested', function() {
            var cli = new Cli(['--help'])

            expect(cli.isHelpRequested()).to.be.true
        })

        it('returns false when help is not requested', function() {
            var cli = new Cli([])

            expect(cli.isHelpRequested()).to.be.false
        })
    })

    describe('showHelp', function() {
        var consoleLogSpy

        beforeEach(function() {
            consoleLogSpy = sinon.stub(console, 'log')
        })

        afterEach(function() {
            consoleLogSpy.restore()
        })

        it('displays help', function() {
            Cli.prototype.showHelp()
            expect(consoleLogSpy.calledOnce).to.be.true
        })
    })
})