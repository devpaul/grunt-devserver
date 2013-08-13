var SandboxedModule = require('sandboxed-module')
  , Cli = require('../../../lib/controller/Cli.js')
  , Config = require('../../../lib/model/Config.js')

describe('startFromConsoleCmdTest', function() {
    var startFromConsoleCmd, startServerSpy

    beforeEach(function() {
        mockDependenciesForUnitUnderTest()
    })

    function mockDependenciesForUnitUnderTest() {
        var UNIT_UNDER_TEST_PATH = '../../../lib/commands/startFromConsoleCmd'
          , options = { requires : { './startServerCmd.js' : createMockStartServer()
                                   , '../model/Config.js' : Config
                                   }
                      }
        startFromConsoleCmd = SandboxedModule.require(UNIT_UNDER_TEST_PATH, options)
    }

    function createMockStartServer() {
        startServerSpy = sinon.stub()
        return startServerSpy
    }

    describe('help', function() {
        var cli, showHelpSpy

        beforeEach(function() {
            cli = new Cli(['--help'])
            showHelpSpy = sinon.stub(Cli.prototype, 'showHelp')
            startFromConsoleCmd(cli)
        })

        afterEach(function() {
            showHelpSpy.restore()
        })

        it('shows help when help is requested', function() {
            expect(showHelpSpy.calledOnce).to.be.true
        })

        it('does not start the server when help is requested', function() {
            expect(startServerSpy.called).to.be.false
        })
    })

    describe('basic configuration', function() {
        it('starts the server', function() {
            startFromConsoleCmd()
            expect(startServerSpy.calledOnce).to.be.true
        })

        it('starts the server with a custom Cli', function() {
            var cli = new Cli()
            startFromConsoleCmd(cli)
            expect(startServerSpy.calledOnce).to.be.true
        })
    })

    describe('multiserver configuration', function() {
        var cli

        beforeEach(function() {
            var loadedOptions = { one: {}
                                , two: {}
                                }

            cli = new Cli(['--server', 'one', '--server', 'two'])
            sinon.stub(Config.prototype, '_loadOptionsFile').returns(loadedOptions)
        })

        afterEach(function() {
            Config.prototype._loadOptionsFile.restore()
        })

        it('starts multiserver', function() {
            startFromConsoleCmd(cli)
            expect(startServerSpy.calledTwice).to.be.true
        })
    })
})