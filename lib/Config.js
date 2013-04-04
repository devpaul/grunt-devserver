function Config() {
    if(!(this instanceof Config))
        return new Config()

    this.port = Config.DEFAULT_PORT
    this.folder = Config.DEFAULT_FOLDER
    this.cacheControl = Config.DEFAULT_CACHE_CONTROL
}

Config.DEFAULT_PORT = 8888
Config.DEFAULT_FOLDER = process.cwd()
Config.DEFAULT_CACHE_CONTROL = 'no-cache'

module.exports = Config