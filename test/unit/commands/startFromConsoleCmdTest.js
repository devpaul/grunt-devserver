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
        startServerSpy = sinon.stub().returns({})
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
            var promise = startFromConsoleCmd(cli)
            expect(promise).to.be.undefined
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
            assertCalledOnce(startFromConsoleCmd())
        })

        function assertCalledOnce(promise) {
            expect(startServerSpy.calledOnce).to.be.true
            expect(promise).to.not.be.undefined
        }

        it('starts the server with a custom Cli', function() {
            var cli = new Cli()
              , promise = startFromConsoleCmd(cli)
            assertCalledOnce(promise);
        })
    })

    describe('multiserver configuration', function() {
        beforeEach(function() {
            mockDependenciesForUnitUnderTest(getMultiServerRequires())
        })


        function assertCalledTwice(promise) {
            expect(startServerSpy.calledTwice).to.be.true
            expect(Array.isArray(promise)).to.be.true
            expect(promise.length).to.be.equal(2)
        }

        it('starts multiple defined servers', function() {
            var basic = { port: 80, server: ['assets', 'production'] }
              , multi = { options: {}, assets: {}, production: {} }
              , options = new CompositeOptions([new BasicOptions(basic), new MultiOptions(multi)])
              , cli = { options: basic, isHelpRequested: function() { return false; }}

            loadCompleteOptions.returns(options)
            assertCalledTwice(startFromConsoleCmd(cli));
        })

        it('starts all servers in a multi server configuration', function() {
            var basic = { port: 80 }
              , multi = { options: {}, assets: {}, production: {} }
              , options = new CompositeOptions([new BasicOptions(basic), new MultiOptions(multi)])
              , cli = { options: basic, isHelpRequested: function() { return false; }}

            loadCompleteOptions.returns(options)
            assertCalledTwice(startFromConsoleCmd(cli))
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