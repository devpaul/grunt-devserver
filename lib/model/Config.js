var _ = require('underscore')

Config.prototype.getOptionsForServers = getOptionsForServers
Config.prototype.getOptionsForServer = getOptionsForServer
Config.prototype.hasDefinition = hasDefinition
Config.prototype._getOptionsForAllServers = getOptionsForAllServers
Config.prototype._getOptionsForSelectServers = getOptionsForSelectServers

function Config(config) {
    if(!config || typeof config !== 'object')
        throw new Error('expected configuration to be an object')

    this._config = config
    this.options = config.options || {}
}

function getOptionsForServers() {
    if(arguments.length === 0)
        return this._getOptionsForAllServers()
    if(isArrayArgPassed(arguments))
        return this._getOptionsForSelectServers(arguments[0])
    else
        return this._getOptionsForSelectServers(Array.prototype.slice.call(arguments))
}

function getOptionsForAllServers() {
    var list = []
    for(var key in this._config)
        if(this._config.hasOwnProperty(key) && key !== 'options')
            list.push(this.getOptionsForServer(key))
    return list
}

function getOptionsForSelectServers(servers) {
    var self = this
      , list = []

    servers.forEach(function(server) {
        list.push(self.getOptionsForServer(server))
    })

    return list
}

function isArrayArgPassed(args) {
    return args.length === 1 && Array.isArray(args[0])
}

function getOptionsForServer(server) {
    if(!this.hasDefinition(server))
        throw new Error('options for server "' + server + '" does not exist')
    return _.extend(_.clone(this.options), this._config[server])
}

function hasDefinition(server) {
    return !!this._config[server]
}

module.exports = Config