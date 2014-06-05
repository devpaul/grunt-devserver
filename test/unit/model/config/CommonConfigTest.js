var SandboxedModule = require('sandboxed-module')
  , util = require('util')

describe('CommonConfigTest', function() {
    describe('defaultMiddleware', function() {
        var Config, morganStub, serveStaticStub, serveIndexStub
          , corsSupportStub, noCacheHeadersStub, pathStub, mockImpl

        beforeEach(function() {
            var unitUnderTestPath = '../../../../lib/model/config/CommonConfig.js'
              , requires = { 'morgan': morganStub = sinon.stub()
                           , 'serve-static': serveStaticStub = sinon.stub()
                           , 'serve-index': serveIndexStub = sinon.stub()
                           , 'path': pathStub = { resolve: sinon.stub() }
                           , '../../middleware/corsSupport': corsSupportStub = sinon.stub()
                           , '../../middleware/noCacheHeaders': noCacheHeadersStub = sinon.stub()
                           }
            mockImpl = { folder: 'folder'
                       , cacheControl : 'cacheControl'
                       }
            Config = SandboxedModule.require(unitUnderTestPath, { requires: requires })
        })

        it('is correctly prototyped', function() {
            expect(Config.defaultMiddleware).to.exist
            expect(Config.defaultMiddleware).to.be.a('function')
        })

        it('creates a list of middleware', function () {
            var middleware = Config.defaultMiddleware.call(mockImpl)

            expect(util.isArray(middleware)).to.be.true
            expect(middleware.length).to.be.equal(5)
            expect(morganStub.called).to.be.true
            expect(serveStaticStub.called).to.be.true
            expect(serveIndexStub.called).to.be.true
            expect(corsSupportStub.called).to.be.true
            expect(noCacheHeadersStub.called).to.be.true
            expect(noCacheHeadersStub.firstCall.args[0]).to.be.equal(mockImpl.cacheControl)
        })

        it('puts serve-index after serve-static', function() {
            Config.defaultMiddleware.call(mockImpl)

            expect(serveStaticStub.called).to.be.true
            expect(serveIndexStub.calledAfter(serveStaticStub)).to.be.true
        })
    })
})