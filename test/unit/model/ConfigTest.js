var Config = require('../../../lib/model/Config.js')

describe('ConfigTest', function() {
    var json, expectedProduction, expectedImage

    beforeEach(function() {
        json = { options: { type: 'https' }
               , image: { port: 4443 }
               , production: { port: 443 }
               }
        expectedProduction = { type: json.options.type, port: json.production.port }
        expectedImage = { type: json.options.type, port: json.image.port }
    })

    describe('construction', function() {
        it('is correctly defined', function() {
            expect(Config).to.not.be.undefined
            expect(Config.prototype.getOptionsForServer).to.not.be.undefined
            expect(Config.prototype.getOptionsForServers).to.not.be.undefined
        })

        it('is correctly constructed', function() {
            var json = { options: { port: 2468 } }
              , config = new Config(json)

            expect(config.options).to.be.equal(json.options)
            expect(config._config).to.be.equal(json)
        })

        it('creates empty options when missing', function() {
            var config = new Config({})

            expect(config.options).to.deep.equal({})
        })

        it('throws when config parameter is not an object', function() {
            expect(function() {
                new Config()
            }).to.throw()
        })
    })

    describe('getOptionsForServer', function() {
        it('merges base options with server options', function() {
            var config = new Config(json)
              , options = config.getOptionsForServer('image')

            expect(options).to.not.be.undefined
            expect(options).to.deep.equal(expectedImage)
        })

        it('overrides base options with server options', function() {
            var json = { options: { port: 4443 }
                       , production: { port: 443 }
                       }
              , expected = { port: 443 }
              , config = new Config(json)
              , options = config.getOptionsForServer('production')

            expect(options).to.not.be.undefined
            expect(options).to.deep.equal(expected)
        })

        it('uses cloned options', function() {
            var config = new Config(json)
              , options = config.getOptionsForServer('image')

            expect(options).to.not.equal(config.options)
        })

        it('throws when server does not exist', function() {
            var config = new Config(json)

            expect(function() {
                config.getOptionsForServer('non-existant server')
            }).to.throw()
        })
    })

    describe('getOptionsForServers', function() {
        var GETDATA = [function () { return Array.prototype.slice.call(arguments) }
                      , function() { return [Array.prototype.slice.call(arguments)] }
                      ]
          , NAME = ['arguments', 'an array']

        it('returns all server options when no arguments are provided', function() {
            var config = new Config(json)
              , serverOptions = config.getOptionsForServers()

            expect(serverOptions.length).to.be.equal(2)
        })

        // Parameterized tests
        GETDATA.forEach(function(getData, index) {
            var name = NAME[index]

            it('returns a single server specified in ' + name, function() {
                var data = getData('production')
                  , config = new Config(json)
                  , servers = Config.prototype.getOptionsForServers.apply(config, data)

                expect(servers.length).to.be.equal(1)
                expect(servers[0]).to.deep.equal(expectedProduction)
            })

            it('returns multiple servers specified in ' + name, function() {
                var data = getData('image', 'production')
                  , config = new Config(json)
                  , servers = Config.prototype.getOptionsForServers.apply(config, data)

                expect(servers.length).to.be.equal(2)
            })

            it('throws when an unknown server is specified in ' + name, function() {
                var data = getData('image', 'unknown server', 'production')
                  , config = new Config(json)

                expect(function() {
                    Config.prototype.getOptionsForServers.apply(config, data)
                }).to.throw()
            })
        })
    })

    describe('hasDefinition', function() {
        var config

        beforeEach(function() {
            config = new Config(json)
        })

        it('returns true when a server config exists', function() {
            expect(config.hasDefinition('production')).to.be.true
        })

        it('returns false when a server config does not exist', function() {
            expect(config.hasDefinition('unknown server')).to.be.false
        })
    })
})