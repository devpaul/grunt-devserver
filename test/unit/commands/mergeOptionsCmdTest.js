var mergeOptionsCmd = require('../../../lib/commands/mergeOptionsCmd.js')

describe('mergeOptionsCmdTest', function() {
    it('returns an empty array when no arguments are provided', function() {
        var actual = mergeOptionsCmd()
        expect(actual).to.deep.equal({});
    })

    it('returns a copy of the first options argument when only one argument is provided', function() {
        var expected = { type: 'http' }
          , actual = mergeOptionsCmd(expected)

        expect(actual).to.deep.equal(expected)
        expect(actual).to.not.be.equal(expected)
    })

    it('merges two options', function() {
        var first = { type: 'gopher' }
          , second = { type: 'http'
                     , port: 80
                     }
          , expected = { type: 'http'
                       , port: 80
                       }
          , actual = mergeOptionsCmd(first, second)

        expect(actual).to.deep.equal(expected)
    })

    it('does a shallow merge of properties', function() {
        var first = { options: { one: 1 } }
          , second = { options: { two: 2 } }
          , expected = second
          , actual = mergeOptionsCmd(first, second)

        expect(actual).to.deep.equal(expected)
    })

    it('merges three options', function() {
        var first = { type: 'gopher' }
          , second = { type: 'http'
                     , port: 80
                     , options: { one: 1 }
                     }
          , third = { type: 'https'
                    , port: 443
                    , options: { two: 2 }
                    }
          , expected = { type: 'https'
                       , port: 443
                       , options: { two: 2 }
                       }
          , actual = mergeOptionsCmd(first, second, third)

        expect(actual).to.deep.equal(expected)
    })
})