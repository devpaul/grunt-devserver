var _ = require('underscore')
  , path = require('path')

Config.prototype.hasServer = hasServer
Config.prototype.getOptions = getOptions
Config.prototype.getServer = getServer
Config.prototype.getServers = getServers
Config.prototype.getAllServers = getAllServers
Config.prototype.isMultiServerConfig = isMultiServerConfig
Config.prototype.getActiveServers = getActiveServers
Config.prototype._loadOptionsFile = loadOptionsFile

function Config(options) {
    if(options === undefined)
        options = {}

    if(options === null || typeof options !== 'object')
        throw new Error('expected configuration to be an object')

    this.servers = initServers(options)
    this._baseoptions = options
    this._loadedOptions = this._loadOptionsFile(options.file)
}

function initServers(options) {
    var servers = options.server

    if(servers && !Array.isArray(servers))
        servers = [servers]

    return servers
}

function loadOptionsFile(filename) {
    if(!filename)
        return {}

    return require(path.resolve(filename))
}

function hasServer(server) {
    return !!this._loadedOptions[server]
}

function getOptions(options) {
    var base = (this._loadedOptions && this._loadedOptions.options) || {}
    options = options || {}
    options = _.extend(_.clone(base), options, this._baseoptions)
    stripConfigData(options)
    return options
}

function stripConfigData(options) {
    delete options.server;
    delete options.file;
}

function getServer(server) {
    return this.getOptions(this._loadedOptions[server])
}

function getServers(servers) {
    var self = this
      , list = []

    if(!servers)
        throw new Error('a list of server names must be provided')

    servers.forEach(function(server) {
        if(!self.hasServer(server))
            throw new Error('Unknown server definition: ' + server)
        list.push(self.getServer(server))
    })

    return list
}

function getAllServers() {
    var list = []
    for(var key in this._loadedOptions)
        if(this._loadedOptions.hasOwnProperty(key) && key !== 'options')
            list.push(this.getServer(key))
    return list
}

function isMultiServerConfig() {
    for(var key in this._loadedOptions)
        if(this._loadedOptions.hasOwnProperty(key) && key !== 'options')
            return true
    return false
}

function getActiveServers() {
    if(!!this.servers) {
        return this.getServers(this.servers)
    } else {
        if(this.isMultiServerConfig())
            return this.getAllServers()
        else
            return [this.getOptions()]
    }
}

module.exports = Config