function Config() {
    if(!(this instanceof Config))
        return new Config()

    this.port = Config.DEFAULT_PORT
    this.folder = Config.DEFAULT_FOLDER
}

Config.DEFAULT_PORT = 8888
Config.DEFAULT_FOLDER = process.cwd()

module.exports = Config