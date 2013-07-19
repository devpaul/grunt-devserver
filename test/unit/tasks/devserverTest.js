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
        var options, devserverTask, taskContext

        function callDevServerTaskWithOptions(opts) {
            options = opts
            taskContext = createTaskContext()
            devserver(gruntStub)
            devserverTask = gruntStub.registerTask.firstCall.args[2]
            devserverTask.call(taskContext)
        }

        function createTaskContext() {
            var gruntOptions = sinon.stub()
            gruntOptions.returns(options)
            return { options : gruntOptions
                   , async : sinon.stub()
                   }
        }

        it('is an async task', function() {
            callDevServerTaskWithOptions({})
            expect(taskContext.async.calledOnce).to.be.true
        })

        it('is an async task when the async option is set to true', function() {
            callDevServerTaskWithOptions({ async : true })
            expect(taskContext.async.called).to.be.true
        })

        it('is not async when the async option is set to false', function() {
            callDevServerTaskWithOptions({ async : false })
            expect(taskContext.async.called).to.be.false
        })

        it('starts the server with the provided options', function() {
            callDevServerTaskWithOptions({})
            expect(startServerCmdSpy.calledOnce).to.be.true
            expect(startServerCmdSpy.firstCall.args[0]).to.deep.equal(options)
        })

        it('loads the complete configuration options', function() {
            callDevServerTaskWithOptions({})
            expect(loadCompleteStub.called).to.be.true
        })
    })
})