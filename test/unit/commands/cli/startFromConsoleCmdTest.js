var SandboxedModule = require('sandboxed-module')
  , HttpConfig = require('../../../../lib/model/HttpConfig.js')

describe('startFromConsoleCmdTest', function() {
    var startFromConsoleCmd, parseCliArgumentsSpy, startServerSpy

    beforeEach(function() {
        mockDependenciesForUnitUnderTest()
        startFromConsoleCmd()
    })

    function mockDependenciesForUnitUnderTest() {
        var UNIT_UNDER_TEST_PATH = '../../../../lib/commands/cli/startFromConsoleCmd'
          , options = { requires : { '../startServerCmd.js' : createMockStartServer()
                                   , './parseCliArgumentsCmd.js' : createMockParseCliArguments()
                                   }
                      }
        startFromConsoleCmd = SandboxedModule.require(UNIT_UNDER_TEST_PATH, options)
    }

    function createMockParseCliArguments() {
        parseCliArgumentsSpy = sinon.stub()
        return parseCliArgumentsSpy
    }

    function createMockStartServer() {
        startServerSpy = sinon.stub()
        return startServerSpy
    }

    it('starts a server when options are returned', function() {
        var options = {}
        parseCliArgumentsSpy.returns(options)

        startFromConsoleCmd()
        expect(startServerSpy.calledOnce).to.be.true
        expect(startServerSpy.firstCall.args[0]).to.be.equal(options)
    })

    it('does not start a server when options are not returned', function() {
        parseCliArgumentsSpy.returns(undefined)

        startFromConsoleCmd()
        expect(startServerSpy.called).to.be.false
    })
})