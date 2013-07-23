var SandboxedModule = require('sandboxed-module')
  , Q = require('q')

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
        var deferred = Q.defer()
        startServerCmdSpy = sinon.stub().returns(deferred.promise)
        startServerCmdSpy.deferred = deferred
        deferred.resolve()
        return startServerCmdSpy
    }

    function createLoadCompleteStub() {
        loadCompleteStub = sinon.stub().returnsArg(0)
        return loadCompleteStub
    }

    function createGruntStub() {
        return { registerMultiTask : sinon.stub() }
    }

    it('registers a devserver grunt task', function() {
        devserver(gruntStub)
        expect(gruntStub.registerMultiTask.calledOnce).to.be.true
        expect(gruntStub.registerMultiTask.firstCall.args[0]).to.be.equal('devserver')
    })

    describe('devServerTask', function() {
        var devserverTask, taskContext, doneStub
          , DATA = [ [{}, false] // [options, callsDone]
                   , [{ async: true }, false]
                   , [{ async: 'garbage'}, false]
                   , [{ async: false}, true]]
          , NAMES = ['undefined', 'true', 'garbage', 'false']

        function callDevServerTaskWithOptions(opts) {
            taskContext = createTaskContext(opts)
            devserver(gruntStub)
            devserverTask = gruntStub.registerMultiTask.firstCall.args[2]
            return devserverTask.call(taskContext)
        }

        function createTaskContext(opts) {
            var gruntOptions = sinon.stub()
            doneStub = sinon.stub()
            gruntOptions.returns(opts)
            return { options : gruntOptions
                   , async : sinon.stub().returns(doneStub)
                   }
        }

        it('loads the complete configuration options', function() {
            callDevServerTaskWithOptions({})
            expect(loadCompleteStub.called).to.be.true
        })

        // Parameterized Test
        DATA.forEach(function(data, index) {
            var options = data[0]
              , callsDone = data[1]
              , name = NAMES[index]
              , doneTestName = (callsDone ? 'does not call' : 'calls') + ' done when async is ' + name

            it('is an async task when async is ' + name, function() {
                callDevServerTaskWithOptions(options)
                expect(taskContext.async.calledOnce).to.be.true
            })

            it('starts the server with the provided options: ' + name, function() {
                callDevServerTaskWithOptions(options)
                expect(startServerCmdSpy.calledOnce).to.be.true
                expect(startServerCmdSpy.firstCall.args[0]).to.deep.equal(options)
            })

            it(doneTestName, function(done) {
                callDevServerTaskWithOptions(options)
                var promise = callDevServerTaskWithOptions(options)
                expect(promise.then(function() {
                    expect(callsDone).to.be.equal(doneStub.calledOnce)
                })).to.be.fulfilled.notify(done)
            })
        })
    })
})