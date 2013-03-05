var request = require('supertest')
  , Server = require('../lib/Server.js')
  , Config = require('../lib/Config.js')

describe("ServerTest", function() {
    var config

    beforeEach(function() {
        config = new Config()
    })

    describe("construction", function() {
        it("is propertly constructed", function() {
            var server = new Server(config)
            assertProperlyConstructed(server, config)
        })

        it("can be constructed functionally", function() {
            var server = Server(config)
            assertProperlyConstructed(server, config)
        })

        function assertProperlyConstructed(server, config) {
            expect(server).to.be.defined
            expect(server).to.be.an.instanceof(Server)
            expect(server.start).to.be.defined
            expect(server.config).to.be.defined
            expect(server.app).to.be.defined
            expect(server.config).to.deep.equal(config)
        }
    })
    
    describe("start", function() {
        var server, listenStub

        beforeEach(function() {
            server = new Server(config)
            listenStub = sinon.stub(server.httpServer, 'listen')
        })

        afterEach(function() {
            listenStub.restore()
        })

        it("starts a server on the configured port", function() {
            server.start()
            expect(listenStub.calledOnce).to.be.true
            expect(listenStub.firstCall.args[0]).to.be.equal(config.port)
        })
    })

    describe("stop", function() {
        var server, closeStub

        beforeEach(function() {
            server = new Server(config)
            closeStub = sinon.stub(server.httpServer, 'close')
        })

        afterEach(function() {
            closeStub.restore()
        })

        it("stops a server", function() {
            server.stop()
            expect(closeStub.calledOnce).to.be.true
        })
    })

    describe("serves content", function() {
        var server

        beforeEach(function() {
            server = Server(config)
        })

        it("serves static content", function(done) {
            request(server.app)
                .get('/')
                .expect(200, done)
        })

        it("adds CORS headers", function(done) {
            request(server.app)
                .get('/')
                .expect('Access-Control-Allow-Origin', '*')
                .end(done)
        })

        it("adds no-cache headers", function(done) {
            request(server.app)
                .get('/')
                .expect('Cache-Control', 'no-cache')
                .end(done)
        })
    })
})