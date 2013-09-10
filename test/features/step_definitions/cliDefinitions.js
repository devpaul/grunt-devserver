var request = require('supertest')
var cliInterface = require('../interface/cliInterface.js')

function cliDefinitions() {
    this.Given(/^I am using the command line$/, function(callback) {
        this.interface = new cliInterface()
        callback()
    })

    this.When(/^I run devserver$/, function(callback) {
        this.interface.run(undefined, callback)
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
        this.interface.run(parameters, callback)
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
        this.interface.configFile = this.createConfigurationFile(name, configuration)
        callback()
    })
}

module.exports = cliDefinitions