var SandboxedModule = require('sandboxed-module')
  , HttpConfig = require('../../../lib/model/config/HttpConfig.js')
  , path = require('path')

describe('createMiddlewareCmdTest', function() {
    var createExpressMiddleware, config, expressConstStub, expressUseStub

    beforeEach(function() {
        var unitUnderTestPath = '../../../lib/commands/createMiddlewareCmd.js'
          , requires = { 'express' : mockExpress() }

        createExpressMiddleware = SandboxedModule.require(unitUnderTestPath, { requires: requires })

        config = new HttpConfig()
        config.folder = path.resolve(path.join(__dirname, '../../assets'))
    })

    function mockExpress() {
        var expressMock = { use : expressUseStub = sinon.stub() }
        expressConstStub = sinon.stub().returns(expressMock)
        return expressConstStub
    }

    it('throws when config is null', function() {
        expect(function() {
            createExpressMiddleware(null)
        }).to.throw(Error)
    })

    it('throws when config is missing middleware', function() {
        expect(function() {
            createExpressMiddleware({})
        }).to.throw(Error)
    })

    it('executes a middleware factory function', function() {
        var middleware = ['one', 'two', 'three']
          , config = stubMiddlewareFunction(middleware)

        createExpressMiddleware(config)

        expect(config.middleware.called).to.be.true
    })

    function stubMiddlewareFunction(middlewareList) {
        return { middleware: sinon.stub().returns(middlewareList) }
    }

    it('adds middleware from a factory function', function() {
        var middleware = ['one', 'two', 'three']
          , config = stubMiddlewareFunction(middleware)

        createExpressMiddleware(config)

        assertMiddlewareIsAdded(middleware)
    })

    function assertMiddlewareIsAdded(middleware) {
        for(var i=0; i < middleware.length; i++)
            expect(expressUseStub.getCall(i).args[0]).to.be.equal(middleware[i])
    }

    it('adds middleware from an array', function() {
        var middleware = ['one', 'two', 'three']
          , config = { middleware: middleware }

        createExpressMiddleware(config)

        assertMiddlewareIsAdded(middleware)
    })

    it('throws with invalid middlware type', function() {
        expect(function() {
            createExpressMiddleware({middleware: {}})
        }).to.throw(Error)
    })

    it('creates an express app', function() {
        var app = createExpressMiddleware(config)

        expect(app).to.be.equal(expressConstStub())
    })
})