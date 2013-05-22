var path = require('path')
  , Server = require('../../../lib/controller/Server.js')
  , HttpConfig = require('../../../lib/model/HttpConfig.js')

describe('ServerTest', function() {
    var config

    beforeEach(function() {
        config = new HttpConfig()
        config.folder = path.resolve(path.join(__dirname, '../assets'))
    })

    describe('construction', function() {
        it('is properly constructed with minimal arguments', function() {
            var server = new Server(config)
            assertProperlyConstructed(server, config)
        })

        it('is properly constructed with optional server argument', function() {
            var httpserver = {}
              , server = new Server(config, httpserver)

            assertProperlyConstructed(server, config)
            expect(server.httpServer).to.be.equal(httpserver)
        })

        it('is properly constructed with optional app argument', function() {
            var app = function() {}
              , server = new Server(config, undefined, app)

            assertProperlyConstructed(server, config)
            expect(server.app).to.be.equal(app)
        })

        function assertProperlyConstructed(server, config) {
            expect(server).to.exist
            expect(server).to.be.an.instanceof(Server)
            expect(server.start).to.exist
            expect(server.config).to.exist
            expect(server.app).to.exist
            expect(server.httpServer).to.exist
            expect(server.config).to.deep.equal(config)
        }
    })

    describe('start', function() {
        var server, listenStub

        beforeEach(function() {
            server = new Server(config)
            listenStub = sinon.stub(server.httpServer, 'listen')
        })

        afterEach(function() {
            listenStub.restore()
        })

        it('starts a server on the configured port', function() {
            server.start()
            expect(listenStub.calledOnce).to.be.true
            expect(listenStub.firstCall.args[0]).to.be.equal(config.port)
        })
    })

    describe('stop', function() {
        var server, closeStub

        beforeEach(function() {
            server = new Server(config)
            closeStub = sinon.stub(server.httpServer, 'close')
        })

        afterEach(function() {
            closeStub.restore()
        })

        it('stops a server', function() {
            server.stop()
            expect(closeStub.calledOnce).to.be.true
        })
    })
})