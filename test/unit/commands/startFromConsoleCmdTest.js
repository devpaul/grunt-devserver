var SandboxedModule = require('sandboxed-module')
  , Cli = require('../../../lib/controller/Cli.js')
  , CompositeOptions = require('../../../lib/model/CompositeOptions.js')
  , BasicOptions = require('../../../lib/model/BasicOptions.js')
  , MultiOptions = require('../../../lib/model/MultiOptions.js')
  , START_FROM_CONSOLE_CMD_PATH = '../../../lib/commands/startFromConsoleCmd'

describe('startFromConsoleCmdTest', function() {
    var startServerSpy, startFromConsoleCmd, loadCompleteOptions

    beforeEach(function() {
        startFromConsoleCmd = require(START_FROM_CONSOLE_CMD_PATH)
    })

    function mockDependenciesForUnitUnderTest(requires) {
        var options = { requires : requires }
        startFromConsoleCmd = SandboxedModule.require(START_FROM_CONSOLE_CMD_PATH, options)
    }

    function getBasicServerRequires() {
        return { './startServerCmd.js' : createMockStartServer()
               }
    }

    function getMultiServerRequires() {
        return { './startServerCmd.js' : createMockStartServer()
               , './loadCompleteOptionsCmd.js' : createMockLoadOptions()
               }
    }

    function createMockStartServer() {
        startServerSpy = sinon.stub()
        return startServerSpy
    }

    function createMockLoadOptions() {
        loadCompleteOptions = sinon.stub()
        return loadCompleteOptions;
    }

    describe('help', function() {
        var cli, showHelpSpy

        beforeEach(function() {
            mockDependenciesForUnitUnderTest(getBasicServerRequires())
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
        beforeEach(function() {
            mockDependenciesForUnitUnderTest(getBasicServerRequires())
        })

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
        beforeEach(function() {
            mockDependenciesForUnitUnderTest(getMultiServerRequires())
        })


        it('starts multiple defined servers', function() {
            var basic = { port: 80, server: ['assets', 'production'] }
              , multi = { options: {}, assets: {}, production: {} }
              , options = new CompositeOptions([new BasicOptions(basic), new MultiOptions(multi)])
              , cli = { options: basic, isHelpRequested: function() { return false; }}

            loadCompleteOptions.returns(options)
            startFromConsoleCmd(cli)
            expect(startServerSpy.calledTwice).to.be.true
        })

        it('starts all servers in a multi server configuration', function() {
            var basic = { port: 80 }
              , multi = { options: {}, assets: {}, production: {} }
              , options = new CompositeOptions([new BasicOptions(basic), new MultiOptions(multi)])
              , cli = { options: basic, isHelpRequested: function() { return false; }}

            loadCompleteOptions.returns(options)
            startFromConsoleCmd(cli)
            expect(startServerSpy.calledTwice).to.be.true
        })

        it('throws when one configuration does not exist', function() {
            var basic = { port: 80, server: ['assets', 'production'] }
              , multi = { options: {}, production: {} }
              , options = new CompositeOptions([new BasicOptions(basic), new MultiOptions(multi)])
              , cli = { options: basic, isHelpRequested: function() { return false; }}

            expect(function() {
                loadCompleteOptions.returns(options)
                startFromConsoleCmd(cli)
            }).to.throw()
        })
    })
})