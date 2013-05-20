var serverTypes = require('./data/serverTypes.json')

function HttpConfig() {
    this.type = serverTypes.HTTP;
    this.port = HttpConfig.DEFAULT_PORT
    this.folder = HttpConfig.DEFAULT_FOLDER
    this.cacheControl = HttpConfig.DEFAULT_CACHE_CONTROL
}

HttpConfig.DEFAULT_PORT = 8888
HttpConfig.DEFAULT_FOLDER = process.cwd()
HttpConfig.DEFAULT_CACHE_CONTROL = 'no-cache'

module.exports = HttpConfig