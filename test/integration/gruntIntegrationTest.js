var http = require('http')
  , e2eOptions = require('../../Gruntconfig.js').devserver.e2e.options
  , Q = require('q')

describe('gruntIntegrationTest', function() {
    it('returns a 200 status code', function(done) {
        var expectedPort = e2eOptions.port
          , url = 'http://localhost:' + expectedPort + '/'

        expect(wget(url).then(onLoadAssert200Status)).to.be.fulfilled.and.notify(done)

        function onLoadAssert200Status(result) {
            expect(result.response.statusCode).to.be.equal(200)
        }
    })
})

function wget(url) {
    var deferred = Q.defer()
      , result = {}
      , body = ''

    http.get(url, onResponse)

    function onResponse(res) {
        result.response = res

        res.on('data', onData)
        res.on('end', onEnd)
    }

    function onData(chunk) {
        body += chunk
    }

    function onEnd() {
        result.body = body
        deferred.resolve(result)
    }

    return deferred.promise
}