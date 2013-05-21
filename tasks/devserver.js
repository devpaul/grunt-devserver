var Server = require('../lib/Server.js')
  , HttpConfig = require('../lib/model/HttpConfig.js')

function devserver(grunt) {
    grunt.registerTask('devserver', 'Start a static web server.', devServerTask);

    function devServerTask() {
        var config = buildConfig(this.options())
          , server = new Server(config)

        this.async()

        server.start()
    }
}

function buildConfig(options) {
    var config = new HttpConfig()
    config.port = options.port || config.port
    config.folder = options.base || config.folder
    config.cacheControl = options.cache || config.cacheControl
    return config
}

devserver.buildConfig = buildConfig
module.exports = devserver