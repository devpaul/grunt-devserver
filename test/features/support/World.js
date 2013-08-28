var request = require('supertest')
  , Tempdir = require('temporary/lib/dir')
  , fs = require('fs')
  , path = require('path')

World.prototype.getClient = getClient
World.prototype.createConfigurationFile = createConfigurationFile
World.prototype.getTempDir = getTempDir

function World(callback) {
    this.servers = []
    this.configFile = {}

    callback()
}

function getClient(serverNum) {
    var port, protocol
    serverNum = serverNum || 0
    port = this.servers[serverNum].config.port
    protocol = this.servers[serverNum].config.type
    return request(protocol + '://localhost:' + port)
}

function getTempDir() {
    if(!this.tempdir)
        this.tempdir = new Tempdir()
    return this.tempdir.path
}

function createConfigurationFile(name, contents) {
    var fullpath = path.join(this.getTempDir(), name)

    fs.writeFileSync(fullpath, contents)
    this.configFile.name = name
    this.configFile.path = fullpath
    return this.configFile
}

module.exports = World