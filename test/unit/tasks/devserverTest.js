var SandboxedModule = require('sandboxed-module')
  , HttpConfig = require('../../../lib/model/HttpConfig.js')
  , buildConfigFromOptionsCmd = require('../../../lib/commands/buildConfigFromOptionsCmd.js')

describe('devserverTest', function() {
    var devserver, ServerSpy, gruntStub, buildConfigSpy

    beforeEach(function() {
        gruntStub = createGruntStub()
        mockDependenciesForUnitUnderTest()
    })

    function mockDependenciesForUnitUnderTest() {
        var options = { requires : { '../lib/controller/Server.js' : createMockServerClass()
                                   , '../lib/commands/buildConfigFromOptionsCmd.js' : createBuildConfigSpy()
                                   }
                      }
        devserver = SandboxedModule.require('../../../tasks/devserver', options)
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

    function createGruntStub() {
        return { registerTask : sinon.stub() }
    }

    it('registers a devserver grunt task', function() {
        devserver(gruntStub)
        expect(gruntStub.registerTask.calledOnce).to.be.true
        expect(gruntStub.registerTask.firstCall.args[0]).to.be.equal('devserver')
    })

    describe('devServerTask', function() {
        var options, devserverTask, taskContext, promise

        beforeEach(function() {
            options = { }
            taskContext = createTaskContext()
            devserver(gruntStub)
            devserverTask = gruntStub.registerTask.firstCall.args[2]
            promise = devserverTask.call(taskContext)
        })

        function createTaskContext() {
            var gruntOptions = sinon.stub()
            gruntOptions.returns(options)
            return { options : gruntOptions
                   , async : sinon.stub()
                   }
        }

        it('is an async task', function() {
            expect(taskContext.async.calledOnce).to.be.true
        })

        it('creates a new server', function(done) {
            expect(promise.then(function() { expect(ServerSpy.calledOnce).to.be.true }))
                .to.be.fulfilled.notify(done)
        })

        it('automatically starts the server on the configured port', function(done) {
            var assertPromise = promise.then(function() {
                expect(ServerSpy.called).to.be.true
                expect(ServerSpy.firstCall.args[0].port).to.equal(HttpConfig.DEFAULT_PORT)
                expect(ServerSpy.startServerStub.calledOnce).to.be.true
            })

            expect(assertPromise).notify(done)
        })

        it('hands off options to build Config', function() {
            expect(buildConfigSpy.calledOnce).to.be.true;
            expect(buildConfigSpy.firstCall.args[0]).to.deep.equal(options)
        })
    })
})