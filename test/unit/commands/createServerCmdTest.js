var createServerCmd = require('../../../lib/commands/createServerCmd.js')
  , HttpConfig = require('../../../lib/model/config/HttpConfig.js')
  , HttpsConfig = require('../../../lib/model/config/HttpsConfig.js')
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

    it('creates a http server', function() {
        var config = new HttpConfig({})
          , server = createServerCmd(config)

        expect(server).to.be.equal(expectedServer)
        expect(http.createServer.calledOnce).to.be.true
    })

    it('creates a https server', function() {
        var config = new HttpsConfig({})
          , server = createServerCmd(config)

        expect(server).to.be.equal(expectedServer)
        expect(https.createServer.calledOnce).to.be.true
    })
})