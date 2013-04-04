var request = require('supertest')
  , path = require('path')
  , Server = require('../../lib/server.js')
  , Config = require('../../lib/Config.js')

describe('ServerTest', function() {
    var config

    beforeEach(function() {
        config = new Config()
        config.folder = path.resolve(path.join(__dirname, '../assets'))
    })

    describe('construction', function() {
        it('is propertly constructed', function() {
            var server = new Server(config)
            assertProperlyConstructed(server, config)
        })

        it('can be constructed functionally', function() {
            /* jshint newcap: false */
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

    describe('serves content', function() {
        var server

        beforeEach(function() {
            server = new Server(config)
        })

        it('serves folders', function(done) {
            request(server.app)
                .get('/')
                .expect(200, done)
        })

        it('serves static content', function(done) {
            request(server.app)
                .get('/test.html')
                .expect(200, done)
        })

        it('replies 404 for missing content', function(done) {
            request(server.app)
                .get('/missing.html')
                .expect(404, done)
        })

        it('adds CORS headers', function(done) {
            request(server.app)
                .get('/test.html')
                .expect('Access-Control-Allow-Origin', '*')
                .end(done)
        })

        it('adds no-cache headers', function(done) {
            assertExpectedCacheHeaders(server, Config.DEFAULT_CACHE_CONTROL, done)
        })

        it('replies 304 for cached content', function(done) {
            var file = '/test.html'

            request(server.app)
                .get(file)
                .expect(200, onResult)

            function onResult(req, res) {
                var etag = res.headers.etag

                request(server.app)
                    .get(file)
                    .set('If-None-Match', etag)
                    .expect(304, done)
            }
        })
    })

    describe('custom caching method', function() {
        it('supplies custom cache headers', function(done) {
            config.cacheControl = 'no-store'
            assertExpectedCacheHeaders(new Server(config), config.cacheControl, done)
        })
    })

    function assertExpectedCacheHeaders(server, expected, done) {
        request(server.app)
            .get('/test.html')
            .expect('Cache-Control', expected)
            .end(done)
    }
})