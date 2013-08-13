var path = require('path')
  , Config = require('../../../lib/model/Config.js')
  , LOADED_FILENAME = path.resolve('.')

describe('ConfigTest', function() {
    var loadOptionsStub
      , multiOptions, fileOptions, basicOptions, expectedProduction, expectedImage, expectedBase

    beforeEach(function() {
        basicOptions = { port: 8080 }
        fileOptions = { file: LOADED_FILENAME }
        multiOptions = { options: { type: 'https' }
                       , image: { port: 4443 }
                       , production: { port: 443 }
                       }
        expectedBase = { type: multiOptions.options.type }
        expectedProduction = { type: multiOptions.options.type, port: multiOptions.production.port }
        expectedImage = { type: multiOptions.options.type, port: multiOptions.image.port }
        loadOptionsStub = sinon.stub(Config.prototype, '_loadOptionsFile')
    })

    afterEach(function() {
        loadOptionsStub.restore()
    })

    function createConfig(options, loadedOptions) {
        if(loadedOptions)
            loadOptionsStub.returns(loadedOptions)

        return new Config(options)
    }

    describe('construction', function() {
        it('is correctly defined', function() {
            expect(Config).to.not.be.undefined
        })

        it('can be minimally constructed', function() {
            var config = new Config()

            expect(config._baseoptions).to.deep.equal({})
        })

        it('is correctly constructed', function() {
            var expectedServers = ['a named server']
              , config

            fileOptions.server = expectedServers[0]
            config = createConfig(fileOptions, multiOptions)

            expect(config.servers).to.deep.equal(expectedServers)
            expect(config._loadedOptions).to.be.equal(multiOptions)
            expect(config._baseoptions).to.be.equal(fileOptions)
        })

        it('loads an options file', function() {
            var loadedOptions = { options: { port: 1234 } }
              , config = createConfig(fileOptions, loadedOptions)

            expect(config._loadedOptions).to.be.equal(loadedOptions)
        })

        it('allows undefined servers', function() {
            var config = new Config({})

            expect(config.servers).to.be.undefined
        })

        it('wraps a single server string parameter in an array', function() {
            var config
            basicOptions.server = 'server'
            config = new Config(basicOptions, 'server')

            expect(config.servers).to.deep.equal(['server'])
        })

        it('allows array of servers', function() {
            var servers = ['production', 'image']
              , config

            basicOptions.server = servers
            config = createConfig(basicOptions)

            expect(config.servers).to.be.equal(servers)
        })
    })

    describe('hasServer', function() {
        var config

        beforeEach(function() {
            config = createConfig(fileOptions, multiOptions)
        })

        it('returns true when a server config exists', function() {
            expect(config.hasServer('production')).to.be.true
        })

        it('returns false when a server config does not exist', function() {
            expect(config.hasServer('unknown server')).to.be.false
        })
    })

    describe('getOptions', function() {
        it('returns base options of a config', function() {
            var config = createConfig(fileOptions, multiOptions)
              , options = config.getOptions()

            expect(options).to.deep.equal(multiOptions.options)
        })

        it('returns overridden options', function() {
            var options = { port: 2468
                          , file: LOADED_FILENAME
                          }
              , config = createConfig(options, multiOptions)
              , expected = { type: multiOptions.options.type, port: 2468 }

            expect(config.getOptions()).to.deep.equal(expected)
        })

        it('returns blended options with overrides', function() {
            var config = createConfig({ port: 2468 }, multiOptions)
              , additional = { cache: 'no-cache', port: 1 }
              , expected = { type: multiOptions.options.type, port: 2468, cache: 'no-cache' }
              , options = config.getOptions(additional)

            expect(options).to.deep.equal(expected)
        })
    })

    describe('getServer', function() {
        it('throws when server does not exist', function() {
            var config = createConfig(fileOptions, multiOptions)

            expect(function() {
                config.getServer('non-existant server')
            }).to.throw()
        })

        it('returns the requested server', function() {
            var config = createConfig(fileOptions, multiOptions)
                , options = config.getServer('image')

            expect(options).to.not.be.undefined
            expect(options).to.deep.equal(expectedImage)
        })
    })

    describe('getServers', function() {
        it('throws when a list of servers is not provided', function() {
            var config = new Config(basicOptions)

            expect(function() {
                config.getServer('unknown server')
            }).to.throw()
        })

        it('returns a single server', function() {
            var config = createConfig(fileOptions, multiOptions)
              , servers = config.getServers(['production'])

            expect(servers.length).to.be.equal(1)
            expect(servers[0]).to.deep.equal(expectedProduction)
        })

        it('returns multiple servers', function() {
            var config = createConfig(fileOptions, multiOptions)
              , servers = config.getServers(['image', 'production'])

            expect(servers.length).to.be.equal(2)
        })

        it('throws when an unknown server is specified in the list', function() {
            var config = createConfig(fileOptions, multiOptions)

            expect(function() {
                config.getServers(['image', 'unknown server', 'production'])
            }).to.throw()
        })
    })

    describe('getAllServers', function() {
        it('returns all servers', function() {
            var config = createConfig(fileOptions, multiOptions)
              , servers = config.getAllServers()

            expect(servers.length).to.be.equal(2)
        })
    })

    describe('isMultiServerConfig', function() {
        it('returns true when a multiserver config is used', function() {
            var config = createConfig(fileOptions, multiOptions)

            expect(config.isMultiServerConfig()).to.be.true
        })

        it('returns false when a basic config is used', function() {
            var config = new Config({ options: { port: 8080 } })

            expect(config.isMultiServerConfig()).to.be.false
        })
    })

    describe('getActiveServers', function() {
        it('returns the basic server', function() {
            var loadedOptions = { options: basicOptions }
              , config = createConfig(fileOptions, loadedOptions)

            expect(config.getActiveServers().length).to.be.equal(1)
            expect(config.getActiveServers()[0]).to.deep.equal(basicOptions)
        })

        it('returns all servers for a multi-server config', function() {
            var config = createConfig(fileOptions, multiOptions)

            expect(config.getActiveServers().length).to.be.equal(2)
        })

        it('returns a single server when configured', function() {
            var options = { options: { port: 2456 }
                          , production: { port: 80 }
                          }
              , config = createConfig(fileOptions, options, ['production'])
              , servers = config.getActiveServers()

            expect(servers.length).to.be.equal(1)
            expect(servers[0]).to.deep.equal(options.production)
        })

        it('returns multiple servers when configured', function() {
            var config = createConfig(fileOptions, multiOptions, ['production', 'image'])
              , servers = config.getActiveServers()

            expect(servers.length).to.be.equal(2)
        })
    })
})