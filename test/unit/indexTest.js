var devserver = require('../../')
  , Sandbox = require('sandboxed-module')

describe("indexTest", function() {
    describe("construction", function() {
        it("is correctly defined", function() {
            expect(devserver).to.be.defined
            expect(devserver.Server).to.be.a('function')
            expect(devserver.HttpConfig).to.be.a('function')
            expect(devserver.HttpsConfig).to.be.a('function')
        })
    })

    describe("devserver", function() {
        var loadOptionsStub, startServerStub

        beforeEach(function() {
            var UNIT_UNDER_TEST_PATH = '../../lib/index.js'
              , requires = { './commands/startServerCmd.js' : startServerStub = sinon.stub()
                           , './commands/loadCompleteOptionsCmd.js' : loadOptionsStub = sinon.spy()
                           }

            devserver = Sandbox.require(UNIT_UNDER_TEST_PATH, { requires: requires })
        })

        it("loads a complete set of options", function() {
            devserver()
            expect(loadOptionsStub.calledOnce).to.be.true
            expect(loadOptionsStub.firstCall.firstArg).to.be.equal(undefined)
        })

        it("defaults to an empty options object when no argument is passed", function() {
            devserver()
            expect(startServerStub.firstCall.args[0]).to.deep.equal({})
        })

        it("starts the server", function() {
            devserver()
            expect(startServerStub.calledOnce).to.be.true
        })
        
        it("", function() {
            
        })
    })
})