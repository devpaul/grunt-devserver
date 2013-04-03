var noCacheHeaders = require('../../../lib/middleware/noCacheHeaders.js')

describe("noCacheHeadersTest", function() {
    var result, next

    beforeEach(function() {
        result = { setHeader : sinon.spy() }
        next = sinon.spy()
        noCacheHeaders(undefined, result, next)
    })

    it("sets no-cache on the result", function() {
        expect(result.setHeader.calledOnce).to.be.true
        expect(result.setHeader.firstCall.args[0]).to.be.equal('Cache-Control')
        expect(result.setHeader.firstCall.args[1]).to.be.equal('no-cache')
    })

    it("calls next", function() {
        expect(next.calledOnce).to.be.true
    })
})