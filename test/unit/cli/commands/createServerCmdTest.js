var createServerCmd = require('../../../../lib/commands/createServerCmd.js')
  , HttpConfig = require('../../../../lib/model/config/HttpConfig.js')
  , HttpsConfig = require('../../../../lib/model/config/HttpsConfig.js')
  , http = require('http')
  , https = require('https')

describe('createServerCmdTest', function() {
    var expectedServer

    beforeEach(function() {
        expectedServer = {}
        sinon.stub(http, 'createServer').returns(expectedServer)
        sinon.stub(https, 'createServer').returns(expectedServer)
    })

    afterEach(function() {
        http.createServer.restore()
        https.createServer.restore()
    })

    it('rejects when config is not present', function() {
        var promise = createServerCmd()

        expect(promise).to.be.rejected
        return promise
    })

    it('rejects when config.type is present and unsupported', function() {
        var config = { type : 'badType' }
        var promise = createServerCmd(config)

        expect(promise).to.be.rejected
        return promise
    })

    it('creates a http server', function() {
        var config = new HttpConfig({})
          , promise = createServerCmd(config)

        expect(promise).to.eventually.equal(expectedServer)
        return promise.then(function () {
            expect(http.createServer.calledOnce).to.be.true
        })
    })

    it('creates a https server', function() {
        var config = new HttpsConfig({})
          , promise = createServerCmd(config)

        expect(promise).to.eventually.equal(expectedServer)
        return promise.then(function () {
            expect(https.createServer.calledOnce).to.be.true
        })
    })
})