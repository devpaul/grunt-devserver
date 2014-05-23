var SandboxedModule = require('sandboxed-module')
  , HttpConfig = require('../../../lib/model/HttpConfig.js')
  , path = require('path')
  , LOGGER_ID = 'logger'
  , STATIC_ID = 'static'
  , DIRECTORY_ID = 'directory'
  , CORS_SUPPORT_ID = 'corsSupport'
  , NO_CACHE_HEADERS_ID = 'noCache'

describe('createMiddlewareCmdTest', function() {
    var createExpressMiddleware, config, expressConstStub, noCacheHeadersStub, serveStaticStub, serveIndexStub

    beforeEach(function() {
        config = new HttpConfig()
        config.folder = path.resolve(path.join(__dirname, '../../assets'))
        setupUnitUnderTest()
    })

    function setupUnitUnderTest() {
        var UNIT_UNDER_TEST_PATH = '../../../lib/commands/createMiddlewareCmd.js'
          , requires = { 'express' : mockExpress()
                       , '../middleware/corsSupport.js' : sinon.stub().returns(CORS_SUPPORT_ID)
                       , '../middleware/noCacheHeaders.js' : noCacheHeadersStub = sinon.stub().returns(NO_CACHE_HEADERS_ID)
                       , 'morgan': sinon.stub().returns(LOGGER_ID)
                       , 'serve-static': (serveStaticStub = sinon.stub().returns(STATIC_ID))
                       , 'serve-index': (serveIndexStub = sinon.stub().returns(DIRECTORY_ID))
                       }

        createExpressMiddleware = SandboxedModule.require(UNIT_UNDER_TEST_PATH, { requires: requires })
    }

    function mockExpress() {
        var expressMock = { use : sinon.stub() }
        expressConstStub = sinon.stub().returns(expressMock)
        return expressConstStub
    }

    it('creates an express app', function() {
        var app = createExpressMiddleware(config)

        expect(app).to.be.equal(expressConstStub())
    })

    function assertMiddlewareRegistered(id) {
        var app = createExpressMiddleware(config)

        expect(app.use.calledWith(id)).to.be.true
    }

    it('registers logging middleware', function() {
        assertMiddlewareRegistered(LOGGER_ID)
    })

    it('registers cors support middleware', function() {
        assertMiddlewareRegistered(CORS_SUPPORT_ID)
    })

    it('registers middleware for serving files and folders', function() {
        assertMiddlewareRegistered(DIRECTORY_ID)
        assertMiddlewareRegistered(STATIC_ID)
    })

    it('registers no cache headers middleware', function() {
        assertMiddlewareRegistered(NO_CACHE_HEADERS_ID)
    })

    it('correctly configures cache control header middleware', function() {
        createExpressMiddleware(config)
        expect(noCacheHeadersStub.calledWith(config.cacheControl)).to.be.true
    })

    it('correctly configures content to be served', function() {
        var folder = path.resolve(config.folder)

        createExpressMiddleware(config)
        expect(serveIndexStub.calledWith(folder)).to.be.true
        expect(serveStaticStub.calledWith(folder)).to.be.true
    })
})