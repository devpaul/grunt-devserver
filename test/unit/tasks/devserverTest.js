var SandboxedModule = require('sandboxed-module')

describe('devserverTest', function() {
    var devserver, gruntStub, startServerCmdSpy, loadCompleteStub

    beforeEach(function() {
        gruntStub = createGruntStub()
        mockDependenciesForUnitUnderTest()
    })

    function mockDependenciesForUnitUnderTest() {
        var options = { requires : { '../lib/commands/startServerCmd.js' : createStartServerCmdSpy()
                                   , '../lib/commands/loadCompleteOptionsCmd.js' : createLoadCompleteStub()
                                   }
                      }
        devserver = SandboxedModule.require('../../../tasks/devserver', options)
    }

    function createStartServerCmdSpy() {
        startServerCmdSpy = sinon.stub()
        return startServerCmdSpy
    }

    function createLoadCompleteStub() {
        loadCompleteStub = sinon.stub().returnsArg(0)
        return loadCompleteStub
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

        it('starts the server with the provided options', function() {
            expect(startServerCmdSpy.calledOnce).to.be.true
            expect(startServerCmdSpy.firstCall.args[0]).to.deep.equal(options)
        })

        it('loads the complete configuration options', function() {
            expect(loadCompleteStub.called).to.be.true
        })
    })
})