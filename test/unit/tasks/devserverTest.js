var SandboxedModule = require('sandboxed-module')
  , Server = require('../../../lib/Server.js')
  , Config = require('../../../lib/Config.js')

describe('devserverTest', function() {
    var devserver, ServerSpy, startServerStub, gruntStub

    beforeEach(function() {
        gruntStub = createGruntStub()
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
        return { registerTask : sinon.stub()
               , config : sinon.stub()
               }
    }

    it('registers a devserver grunt task', function() {
        devserver(gruntStub)
        expect(gruntStub.registerTask.calledOnce).to.be.true
        expect(gruntStub.registerTask.firstCall.args[0]).to.be.equal('devserver')
    })

    describe('devServerTask', function() {
        var asyncStub, devserverTask

        beforeEach(function() {
            asyncStub = { async : sinon.stub() }
            devserver(gruntStub)
            devserverTask = gruntStub.registerTask.firstCall.args[2]
            devserverTask.call(asyncStub)
        })

        it('is an async task', function() {
            expect(asyncStub.async.calledOnce).to.be.true
        })

        it('creates a new server', function() {
            expect(ServerSpy.calledOnce).to.be.true
        })

        it('automatically starts the server on the configured port', function() {
            var server = ServerSpy.thisValues[0]
            expect(server).to.be.defined
            expect(startServerStub.calledOnce).to.be.true
            expect(server.config.port).to.be.equal(Config.DEFAULT_PORT)
        })
    })

    describe('buildConfig', function() {
        var configMap, grunt

        beforeEach(function() {
            grunt = { config : getConfig }
            configMap = {}
        })

        function getConfig(name) {
            return configMap[name]
        }

        it('defaults the server port when one is not provided', function() {
            var config = devserver.buildConfig(grunt)
            expect(config.port).to.be.equal(Config.DEFAULT_PORT)
        })

        it('configures the server port number from grunt', function() {
            var expected = configMap['devserver.port'] = 2468
              , config = devserver.buildConfig(grunt)
            expect(config.port).to.be.equal(expected)
        })

        it('defaults the folder when one is not provided', function() {
            var config = devserver.buildConfig(grunt)
            expect(config.folder).to.be.equal(Config.DEFAULT_FOLDER)
        })

        it('configures the folder from grunt', function() {
            var expected = configMap['devserver.base'] = '../'
              , config = devserver.buildConfig(grunt)
            expect(config.folder).to.be.equal(expected)
        })

        it('defaults to cache method when one is not provided', function() {
            var config = devserver.buildConfig(grunt)
            expect(config.cacheControl).to.be.equal(Config.DEFAULT_CACHE_CONTROL)
        })

        it('configures the cache method from grunt', function() {
            var expected = configMap['devserver.cache'] = 'potato'
              , config = devserver.buildConfig(grunt)

            expect(config.cacheControl).to.be.equal(expected)
        })
    })
})