var SandboxedModule = require('sandboxed-module')
var Q = require('q')

describe('startServerCmdTest', function() {
    var startServerCmd, buildServerStub, httpStub, httpsStub, buildServerDefer, serverStub

    beforeEach(function() {
        var requires

        serverStub = { start: sinon.stub() }
        buildServerDefer = Q.defer()
        buildServerStub = sinon.stub().returns(buildServerDefer.promise)
        requires =  { '../model/config/HttpConfig.js': httpStub = sinon.stub()
                    , '../model/config/HttpsConfig.js': httpsStub = sinon.stub()
                    , './buildServerCmd.js': buildServerStub
                    }

        startServerCmd = SandboxedModule.require('../../../lib/commands/startServerCmd', { requires: requires })
    })

    it('creates a new http server', function() {
        var options = { type: 'http' }
        var promise = startServerCmd(options)

        buildServerDefer.resolve(serverStub)

        expect(httpStub.called).to.be.true
        return expect(promise).to.eventually.equal(serverStub)
    })

    it('creates a new https server', function() {
        var options = { type: 'https' }
        var promise = startServerCmd(options)

        buildServerDefer.resolve(serverStub)

        expect(httpsStub.called).to.be.true
        return expect(promise).to.eventually.equal(serverStub)
    })

    it('automatically starts the server', function() {
        var options = { type: 'http' }
        var promise = startServerCmd(options)

        buildServerDefer.resolve(serverStub)

        return promise.then(function () {
            expect(serverStub.start.called).to.be.true
        })
    })

    it('rejects when server promise rejects', function() {
        var promise = startServerCmd({})

        buildServerDefer.reject()

        return expect(promise).to.eventually.be.rejected
    })
})