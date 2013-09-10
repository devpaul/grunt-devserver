var request = require('supertest')

function expectationDefinitions() {
    this.Then(/^I expect a http server is started on port "([^"]*)"$/, function(port, callback) {
        var client = request('http://localhost:' + port)
        client.get('/').expect(200, callback)
    })

    this.Then(/^I expect a https server is started on port "([^"]*)"$/, function(port, callback) {
        var client = request('https://localhost:' + port)
        client.get('/').expect(200, callback)
    })

    this.Then(/^I expect cache\-control to be "([^"]*)"$/, function(cachetype, callback) {
        var client = this.getClient()
        client.get('/').expect('cache-control', cachetype).expect(200, callback)
    })

    this.Then(/^I expect the url "([^"]*)" to exist$/, function(url, callback) {
        var client = this.getClient()
        client.get(url).expect(200, callback)
    })
}

module.exports = expectationDefinitions