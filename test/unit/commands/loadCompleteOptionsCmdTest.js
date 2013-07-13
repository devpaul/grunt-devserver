var SandboxedModule = require('sandboxed-module')
  , path = require('path')

describe('loadCompleteOptionsCmdTest', function() {
    var loadCompleteOptionsCmd

    function setupUnitUnderTest(requires) {
        var UNIT_UNDER_TEST_PATH = '../../../lib/commands/loadCompleteOptionsCmd.js'

        if(!requires)
            loadCompleteOptionsCmd = require(UNIT_UNDER_TEST_PATH)
        else
            loadCompleteOptionsCmd = SandboxedModule.require(UNIT_UNDER_TEST_PATH, { requires: requires })
    }

    it('throws when a file is missing', function() {
        setupUnitUnderTest()
        expect(loadCompleteOptionsCmd).to.throw()
    })

    it('loads one option file without a file reference', function() {
        var options = { type: 'http' }
          , expected = options

        setupUnitUnderTest()

        expect(loadCompleteOptionsCmd(options)).to.deep.equal(expected)
    })

    it('loads an option file with a file reference', function() {
        var filename = 'first'
          , options = { type: 'http'
                      , file: filename
                      }
          , firstOption = { type: 'https' }
          , expected = { type: 'https'
                       , file: filename
                       }
          , files = {}

        files[path.resolve(filename)] = firstOption
        setupUnitUnderTest(files)

        expect(loadCompleteOptionsCmd(options)).to.deep.equal(expected)
    })

    it('loads an option file with many chained references', function() {
        var firstFilename = 'first'
          , secondFilename = 'second'
          , options = { type: 'http'
                      , file: firstFilename
                      }
          , firstOptions = { type: 'https'
                           , file: secondFilename
                           }
          , secondOptions = { cacheControl: 'no-cache' }
          , expected = { type: 'https'
                       , cacheControl: 'no-cache'
                       , file: secondFilename
                       }
          , files = {}

        files[path.resolve(firstFilename)] = firstOptions
        files[path.resolve(secondFilename)] = secondOptions
        setupUnitUnderTest(files)

        expect(loadCompleteOptionsCmd(options)).to.deep.equal(expected)
    })

    it('throws when a load cycle is detected', function() {
        var filename = 'first'
          , options = { file: 'first' }
          , files = {}

        files[path.resolve(filename)] = options
        setupUnitUnderTest(files)

        expect(function() {
            loadCompleteOptionsCmd(options)
        }).to.throw()
    })
})