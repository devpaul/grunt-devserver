var SandboxedModule = require('sandboxed-module')
  , Server = require('../../../lib/controller/Server.js')
  , HttpConfig = require('../../../lib/model/HttpConfig.js')

describe('startFromConsoleCmdTest', function() {
    var startFromConsoleCmd, ServerSpy, startServerStub

    beforeEach(function() {
        mockDependenciesForUnitUnderTest()
        startFromConsoleCmd()
    })

    afterEach(function() {
        startServerStub.restore()
    })

    function mockDependenciesForUnitUnderTest() {
        var UNIT_UNDER_TEST_PATH = '../../../lib/cli/startFromConsoleCmd'
          , options = { requires : { '../controller/Server.js' : createMockServer() } }
        startFromConsoleCmd = SandboxedModule.require(UNIT_UNDER_TEST_PATH, options)
    }

    function createMockServer() {
        ServerSpy = sinon.spy(Server)
        startServerStub = sinon.stub(Server.prototype, 'start')
        return ServerSpy
    }

    it('creates a new server', function() {
        expect(ServerSpy.calledOnce).to.be.true
    })

    it('automatically starts the server on the configured port', function() {
        var server = ServerSpy.thisValues[0]
        expect(server).to.exist
        expect(startServerStub.calledOnce).to.be.true
        expect(server.config.port).to.be.equal(HttpConfig.DEFAULT_PORT)
    })
})