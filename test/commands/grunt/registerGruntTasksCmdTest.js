var SandboxedModule = require('sandboxed-module')
  , Server = require('../../../lib/Server.js')
  , Config = require('../../../lib/Config.js')

describe("registerGruntTasksCmdTest", function() {
    var registerGruntTasksCmd, ServerSpy, startServerStub, gruntStub

    beforeEach(function() {
        gruntStub = createGruntStub()
        mockDependenciesForUnitUnderTest()
    })

    afterEach(function() {
        startServerStub.restore()
    })

    function mockDependenciesForUnitUnderTest() {
        var options = { requires : { '../../Server.js' : createMockServer() } }
        registerGruntTasksCmd = SandboxedModule.require('../../../lib/commands/grunt/registerGruntTasksCmd', options)
    }

    function createMockServer() {
        ServerSpy = sinon.spy(Server)
        startServerStub = sinon.stub(Server.prototype, 'start')
        return ServerSpy
    }

    function createGruntStub() {
        return { registerTask : sinon.stub()
               , config : sinon.stub()
               }
    }

    it("registers a devserver grunt task", function() {
        registerGruntTasksCmd(gruntStub)
        expect(gruntStub.registerTask.calledOnce).to.be.true
        expect(gruntStub.registerTask.firstCall.args[0]).to.be.equal('devserver')
    })

    describe("devServerTask", function() {
        var asyncStub, devserverTask

        beforeEach(function() {
            asyncStub = { async : sinon.stub() }
            registerGruntTasksCmd(gruntStub)
            devserverTask = gruntStub.registerTask.firstCall.args[2]
            devserverTask.call(asyncStub)
        })

        it("is an async task", function() {
            expect(asyncStub.async.calledOnce).to.be.true
        })

        it("creates a new server", function() {
            expect(ServerSpy.calledOnce).to.be.true
        })

        it("automatically starts the server on the configured port", function() {
            var server = ServerSpy.thisValues[0]
            expect(server).to.be.defined
            expect(startServerStub.calledOnce).to.be.true
            expect(server.config.port).to.be.equal(Config.DEFAULT_PORT)
        })
    })
})