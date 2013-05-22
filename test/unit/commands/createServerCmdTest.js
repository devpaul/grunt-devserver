var createServerCmd = require('../../../lib/commands/createServerCmd.js')
  , HttpConfig = require('../../../lib/model/HttpConfig.js')
  , HttpsConfig = require('../../../lib/model/HttpsConfig.js')
  , http = require('http')
  , https = require('https')

describe('createServerCmdTest', function() {
    it('throws when config is not present', function() {
        expect(function() {
            createServerCmd()
        }).to.throw(Error)
    })

    it('throws when config.type is present and unsupported', function() {
        var config = { type : 'badType' }
        expect(function() {
            createServerCmd(config)
        }).to.throw(Error)
    })

    describe('create http server', function() {
        var config

        beforeEach(function() {
            config = new HttpConfig()
        })

        it('creates server when config.type is set to http', function() {
            var server = createServerCmd(config)

            expect(server).to.exist
            expect(server).to.be.an.instanceof(http.Server)
        })

        it('attaches middleware to request event', function() {
            assertMiddlewareHandledRequest(config);
        })
    })

    describe('create https server', function() {
        var config

        beforeEach(function() {
            config = new HttpsConfig({})
        })

        it('creates server when config.type is set to https', function() {
            var server = createServerCmd(config)

            expect(server).to.exist
            expect(server).to.be.an.instanceof(https.Server)
        })

        it('attaches middleware to request event', function() {
            assertMiddlewareHandledRequest(config)
        })
    })

    function assertMiddlewareHandledRequest(config) {
        var app = sinon.spy()
          , server = new createServerCmd(config, app)

        server.emit('request')
        expect(app.calledOnce).to.be.true
    }
})