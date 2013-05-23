var SandboxedModule = require('sandboxed-module')
  , HttpConfig = require('../../../lib/model/HttpConfig.js')
  , buildConfigFromOptionsCmd = require('../../../lib/commands/buildConfigFromOptionsCmd.js')

describe('startServerCmdTest', function() {
    var startServerCmd, ServerSpy, buildConfigSpy

    beforeEach(function() {
        mockDependenciesForUnitUnderTest()
    })

    function mockDependenciesForUnitUnderTest() {
        var options = { requires : { '../controller/Server.js' : createMockServerClass()
                                   , './buildConfigFromOptionsCmd.js' : createBuildConfigSpy()
                                   }
                      }
        startServerCmd = SandboxedModule.require('../../../lib/commands/startServerCmd', options)
    }

    function createBuildConfigSpy() {
        buildConfigSpy = sinon.spy(buildConfigFromOptionsCmd)
        return buildConfigSpy
    }

    function createMockServerClass() {
        var startServerStub = sinon.stub()
        ServerSpy = sinon.stub().returns({ start: startServerStub })
        ServerSpy.startServerStub = startServerStub
        return ServerSpy
    }

    it('creates a new server', function(done) {
        var options = {}
          , promise = startServerCmd(options)
        expect(promise.then(function() { expect(ServerSpy.calledOnce).to.be.true }))
            .to.be.fulfilled.notify(done)
    })

    it('automatically starts the server on the configured port', function(done) {
        var options = {}
          , promise = startServerCmd(options)
          , assertPromise = promise.then(function() {
            expect(ServerSpy.called).to.be.true
            expect(ServerSpy.firstCall.args[0].port).to.equal(HttpConfig.DEFAULT_PORT)
            expect(ServerSpy.startServerStub.calledOnce).to.be.true
        })

        expect(assertPromise).notify(done)
    })

    it('hands off options to build Config', function() {
        var options = {}
        startServerCmd(options)
        expect(buildConfigSpy.calledOnce).to.be.true;
        expect(buildConfigSpy.firstCall.args[0]).to.deep.equal(options)
    })
})