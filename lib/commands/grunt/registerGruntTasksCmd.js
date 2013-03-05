var Server = require('../../Server.js')
  , buildConfigFromGruntCmd = require('./buildConfigFromGruntConfigCmd.js')

function registerGruntTasksCmd(grunt) {
    grunt.registerTask('devserver', 'Start a static web server.', devServerTask);

    function devServerTask() {
        var config = buildConfigFromGruntCmd(grunt)
          , server = new Server(config)

        this.async()

        server.start()
    }
}

module.exports = registerGruntTasksCmd