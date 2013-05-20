var serverTypes = require('./data/serverTypes.json')

function HttpsConfig(options) {
    this.type = serverTypes.HTTPS
    this.port = HttpsConfig.DEFAULT_PORT
    this.folder = HttpsConfig.DEFAULT_FOLDER
    this.cacheControl = HttpsConfig.DEFAULT_CACHE_CONTROL
    this.options = options || createDefaultHttpsOptions();
}

function createDefaultHttpsOptions() {
    return {};
}

HttpsConfig.DEFAULT_PORT = 8443
HttpsConfig.DEFAULT_FOLDER = process.cwd()
HttpsConfig.DEFAULT_CACHE_CONTROL = 'no-cache'

module.exports = HttpsConfig