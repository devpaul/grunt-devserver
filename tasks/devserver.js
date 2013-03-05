var Server = require('../lib/Server.js')
  , Config = require('../lib/Config.js')

function devserver(grunt) {
    grunt.registerTask('devserver', 'Start a static web server.', devServerTask);

    function devServerTask() {
        var config = buildConfig(grunt)
          , server = new Server(config)

        this.async()

        server.start()
    }
}

function buildConfig(grunt) {
    var config = new Config()
    config.port = grunt.config('devserver.port') || config.port
    config.folder = grunt.config('devserver.base') || config.folder
    return config
}

devserver.buildConfig = buildConfig
module.exports = devserver