var SandboxedModule = require('sandboxed-module')
  , HttpConfig = require('../../../lib/model/HttpConfig.js')
  , Server = require('../../../lib/controller/Server.js')
  , buildConfigFromOptionsCmd = require('../../../lib/commands/buildConfigFromOptionsCmd.js')

describe('devserverTest', function() {
    var mockOptions = new HttpConfig()
      , devserver, ServerSpy, startServerStub, gruntStub, buildConfigSpy

    beforeEach(function() {
        gruntStub = createGruntStub()
        mockDependenciesForUnitUnderTest()
    })

    afterEach(function() {
        startServerStub.restore()
    })

    function mockDependenciesForUnitUnderTest() {
        var options = { requires : { '../lib/controller/Server.js' : createMockServer()
                                   , '../lib/commands/buildConfigFromOptionsCmd.js' : createBuildConfigSpy()
                                   }
                      }
        devserver = SandboxedModule.require('../../../tasks/devserver', options)
    }

    function createBuildConfigSpy() {
        buildConfigSpy = sinon.spy(buildConfigFromOptionsCmd)
        return buildConfigSpy
    }

    function createMockServer() {
        ServerSpy = sinon.spy(Server)
        startServerStub = sinon.stub(Server.prototype, 'start')
        return ServerSpy
    }

    function createGruntStub() {
        return { registerTask : sinon.stub() }
    }

    it('registers a devserver grunt task', function() {
        devserver(gruntStub)
        expect(gruntStub.registerTask.calledOnce).to.be.true
        expect(gruntStub.registerTask.firstCall.args[0]).to.be.equal('devserver')
    })

    describe('devServerTask', function() {
        var devserverTask, taskContext

        beforeEach(function() {
            taskContext = createTaskContext()
            devserver(gruntStub)
            devserverTask = gruntStub.registerTask.firstCall.args[2]
            devserverTask.call(taskContext)
        })

        function createTaskContext() {
            var options = sinon.stub()
            options.returns(mockOptions)
            return { options : options
                   , async : sinon.stub()
                   }
        }

        it('is an async task', function() {
            expect(taskContext.async.calledOnce).to.be.true
        })

        it('creates a new server', function() {
            expect(ServerSpy.calledOnce).to.be.true
        })

        it('automatically starts the server on the configured port', function() {
            var server = ServerSpy.thisValues[0]
            expect(server).to.exist
            expect(startServerStub.calledOnce).to.be.true
            expect(server.config.port).to.be.equal(HttpConfig.DEFAULT_PORT)
        })

        it('hands off options to build Config', function() {
            expect(buildConfigSpy.calledOnce).to.be.true;
            expect(buildConfigSpy.firstCall.args[0]).to.deep.equal(mockOptions)
        })
    })
})