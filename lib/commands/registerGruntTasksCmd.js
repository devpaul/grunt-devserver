var Server = require('../Server.js')
  , Config = require('../Config.js')

function registerGruntTasksCmd(grunt) {
    grunt.registerTask('devserver', 'Start a static web server.', devServerTask);

    function devServerTask() {
        var config = createServerConfig(grunt)
          , server = new Server(config)

        this.async()

        server.start()
    }
}

function createServerConfig(grunt) {
    var config = new Config()
    config.port = grunt.config('devserver.port') || config.port
    config.folder = grunt.config('devserver.base') || config.folder
    return config
}

module.exports = registerGruntTasksCmd