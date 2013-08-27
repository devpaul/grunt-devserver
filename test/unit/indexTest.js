var Sandbox = require('sandboxed-module')
  , loadCompleteOptionsCmd = require('../../lib/commands/loadCompleteOptionsCmd.js')
  , devserver

describe('indexTest', function() {
    beforeEach(function() {
        devserver = require('../../')
    })

    describe('construction', function() {
        it('is correctly defined', function() {
            expect(devserver).to.be.defined
            expect(devserver.Server).to.be.a('function')
            expect(devserver.HttpConfig).to.be.a('function')
            expect(devserver.HttpsConfig).to.be.a('function')
            expect(devserver.BasicOptions).to.be.a('function')
            expect(devserver.MultiOptions).to.be.a('function')
            expect(devserver.CompositeOptions).to.be.a('function')
        })
    })

    describe('devserver', function() {
        var loadOptionsSpy, startServerStub

        beforeEach(function() {
            var UNIT_UNDER_TEST_PATH = '../../lib/index.js'
              , requires = { './commands/startServerCmd.js' : startServerStub = sinon.stub()
                           , './commands/loadCompleteOptionsCmd.js' : loadOptionsSpy = sinon.spy(loadCompleteOptionsCmd)
                           }

            devserver = Sandbox.require(UNIT_UNDER_TEST_PATH, { requires: requires })
        })

        function assertOptionsUsed(options, expected) {
            devserver(expected)
            expect(loadOptionsSpy.calledOnce).to.be.true
            expect(loadOptionsSpy.firstCall.args[0]).to.be.equal(expected)
            expect(startServerStub.firstCall.args[0]).to.deep.equal(expected)
        }

        it('loads a complete set of options', function() {
            var expected = { port: 100 }
            assertOptionsUsed(expected, expected)
        })

        it('supports passing a *Option object', function() {
            var expected = { port: 100 }
              , options = new devserver.BasicOptions(expected)

            assertOptionsUsed(options, expected)
        })

        it('defaults to an empty options object when no argument is passed', function() {
            devserver()
            expect(startServerStub.firstCall.args[0]).to.deep.equal({})
        })

        it('starts the server', function() {
            devserver()
            expect(startServerStub.calledOnce).to.be.true
        })

        it('returns the promise from the start server command', function() {
            var expected = 'expected'
            startServerStub.returns(expected)
            expect(devserver()).to.be.equal(expected)
        })
    })
})