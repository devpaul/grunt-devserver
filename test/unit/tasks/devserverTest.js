var SandboxedModule = require('sandboxed-module')
  , Server = require('../../../lib/Server.js')
  , HttpConfig = require('../../../lib/model/HttpConfig.js')
  , serverTypes = require('../../../lib/model/data/serverTypes.json')
  , path = require('path')

describe('devserverTest', function() {
    var mockOptions = { test : 'test' }
      , devserver, ServerSpy, startServerStub, gruntStub, taskContext

    beforeEach(function() {
        gruntStub = createGruntStub()
        taskContext = createTaskContext()
        mockDependenciesForUnitUnderTest()
    })

    afterEach(function() {
        startServerStub.restore()
    })

    function mockDependenciesForUnitUnderTest() {
        var options = { requires : { '../lib/Server.js' : createMockServer() } }
        devserver = SandboxedModule.require('../../../tasks/devserver', options)
    }

    function createMockServer() {
        ServerSpy = sinon.spy(Server)
        startServerStub = sinon.stub(Server.prototype, 'start')
        return ServerSpy
    }

    function createGruntStub() {
        return { registerTask : sinon.stub() }
    }

    function createTaskContext() {
        return { options : sinon.stub.returns(mockOptions)
               , async : sinon.stub()
               }
    }

    it('registers a devserver grunt task', function() {
        devserver(gruntStub)
        expect(gruntStub.registerTask.calledOnce).to.be.true
        expect(gruntStub.registerTask.firstCall.args[0]).to.be.equal('devserver')
    })

    describe('devServerTask', function() {
        var devserverTask

        beforeEach(function() {
            devserver(gruntStub)
            devserverTask = gruntStub.registerTask.firstCall.args[2]
            devserverTask.call(taskContext)
            sinon.stub(devserver, 'buildConfig')
        })

        it('is an async task', function() {
            expect(taskContext.async.calledOnce).to.be.true
        })

        it('creates a new server', function() {
            expect(ServerSpy.calledOnce).to.be.true
        })

        it('automatically starts the server on the configured port', function() {
            var server = ServerSpy.thisValues[0]
            expect(server).to.be.defined
            expect(startServerStub.calledOnce).to.be.true
            expect(server.config.port).to.be.equal(HttpConfig.DEFAULT_PORT)
        })

        it('hands off options to build Config', function() {

        })
    })

    describe('buildConfig', function() {
        it('defaults the server port when one is not provided', function() {
            assertConfigValueSet('port', HttpConfig.DEFAULT_PORT)
        })

        function assertConfigValueSet(configKey, expected, options) {
            var config = devserver.buildConfig(options || {})
            expect(config[configKey]).to.be.equal(expected)
        }

        it('configures the server port number from grunt', function() {
            var expected = 2468
            assertConfigValueSet('port', expected, { port : expected })
        })

        it('defaults the folder when one is not provided', function() {
            assertConfigValueSet('folder', HttpConfig.DEFAULT_FOLDER)
        })

        it('configures the folder from grunt', function() {
            var expected = '../'
            assertConfigValueSet('folder', expected, { base : expected})
        })

        it('defaults to cache method when one is not provided', function() {
            assertConfigValueSet('cacheControl', HttpConfig.DEFAULT_CACHE_CONTROL)
        })

        it('configures the cache method from grunt', function() {
            var expected = 'potato'
            assertConfigValueSet('cacheControl', expected, { cache : expected})
        })

        it('defaults to HTTPConfig when no type is declared', function() {
            assertConfigValueSet('type', serverTypes.HTTP)
        })
    })
})