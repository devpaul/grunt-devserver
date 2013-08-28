var Q = require('q')
  , Cli = require('../../../lib/controller/Cli.js')
  , request = require('supertest')
  , startFromConsoleCmd = require('../../../lib/commands/startFromConsoleCmd.js')
  , World = require('../support/World.js')

require('../../common.js')

function cliDefinitions() {
    this.World = World

    this.After(function (callback) {
        this.servers.forEach(function(server) {
            server.stop()
        })

        callback()
    })

    this.Given(/^I am using the command line$/, function(callback) {
        createCliSandbox.call(this)
        callback()
    })

    this.When(/^I run devserver$/, function(callback) {
        runFromCommandLine.call(this, undefined, callback)
    })

    this.Then(/^I expect a http server is started on port "([^"]*)"$/, function(port, callback) {
        var client = request('http://localhost:' + port)
        client.get('/').expect(200, callback)
    })

    this.Then(/^I expect a https server is started on port "([^"]*)"$/, function(port, callback) {
        var client = request('https://localhost:' + port)
        client.get('/').expect(200, callback)
    })

    this.When(/^I run devserver with the configuration:$/, function(parameters, callback) {
        runFromCommandLine.call(this, parameters, callback)
    })

    this.Then(/^I expect cache\-control to be "([^"]*)"$/, function(cachetype, callback) {
        var client = this.getClient()
        client.get('/').expect('cache-control', cachetype).expect(200, callback)
    })

    this.Then(/^I expect the url "([^"]*)" to exist$/, function(url, callback) {
        var client = this.getClient()
        client.get(url).expect(200, callback)
    })

    this.Given(/^an external configuration file named "([^"]*)" with contents:$/, function(name, configuration, callback) {
        this.createConfigurationFile(name, configuration)
        callback()
    })
}

function runFromCommandLine(parameters, callback) {
    var self = this
      , promise = this.run(parameters)

    promise.then(function(server) {
        if(Array.isArray(server))
            self.servers = server
        else
            self.servers.push(server)
        callback()
    }).fail(callback)
}

function createCliSandbox() {
    this.run = function(parameters) {
        var argv = cleanParameters.call(this, parameters)
          , cli = new Cli(argv)
          , promise = startFromConsoleCmd(cli)

        if(Array.isArray(promise))
            return Q.all(promise)
        return promise
    }
}

function cleanParameters(params) {
    if(!params)
        return ''
    if(this.configFile.name && this.configFile.path)
        params = params.replace(this.configFile.name, this.configFile.path)
    params = params.trim()

    return params.split(' ')
}

module.exports = cliDefinitions