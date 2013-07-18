var http = require('http')
  , Q = require('q')

describe('create a server from the command line', function() {
    it('starts a server when no arguments are supplied', function(done) {
        var deferred = Q.defer()
          , promise = deferred.promise
          , stub = sinon.stub(http, 'createServer', deferred.resolve)
        require('../../bin/devserver')
        expect(promise).to.be.fulfilled
        promise.then(function () {
            stub.restore()
            done()
        })
    })
})