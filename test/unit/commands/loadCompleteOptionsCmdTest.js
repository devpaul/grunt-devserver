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

    it('returns the passed options when no file load is present', function() {
        var options = {}
          , actual

        setupUnitUnderTest()
        actual = loadCompleteOptionsCmd(options)
        expect(options).to.be.equal(actual)
    })

    it('loads one option file without a file reference', function() {
        var options = { type: 'http' }
          , expected = { type: 'http' }

        setupUnitUnderTest()

        expect(loadCompleteOptionsCmd(options)).to.deep.equal(expected)
    })

    it('loads an option file with a file reference', function() {
        var filename = 'first'
          , options = { type: 'http'
                      , file: filename
                      }
          , optionFile = { options: { type: 'https'
                                    , cache: 'no-cache'
                                    }
                         }
          , expected = { type: 'http'
                       , cache: 'no-cache'
                       , file: filename
                       }
          , files = {}

        files[path.resolve(filename)] = optionFile
        setupUnitUnderTest(files)

        expect(loadCompleteOptionsCmd(options)).to.deep.equal(expected)
    })

    it('throws on a malformed option configuration file', function() {
        var filename = 'first'
          , options = { type: 'http'
                      , file: filename
                      }
          , optionFile = {}
          , files = {}

        files[path.resolve(filename)] = optionFile
        setupUnitUnderTest(files)

        expect(function() {
            loadCompleteOptionsCmd(options)
        }).to.throw()
    })

    it('does not support loading recursive configuration files', function() {
        var firstFilename = 'first'
          , secondFilename = 'second'
          , options = { type: 'http'
                      , file: firstFilename
                      }
          , firstFile = { options: { type: 'https'
                                   , file: secondFilename
                                   }
                        }
          , secondFile = { cacheControl: 'no-cache' }
          , expected = { type: 'http'
                       , file: firstFilename
                       }
          , files = {}

        files[path.resolve(firstFilename)] = firstFile
        files[path.resolve(secondFilename)] = secondFile
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