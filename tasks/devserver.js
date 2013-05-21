var Server = require('../lib/Server.js')
  , buildConfigFromOptions = require('../lib/commands/buildConfigFromOptionsCmd.js')

function devserver(grunt) {
    grunt.registerTask('devserver', 'Start a static web server.', devServerTask);

    function devServerTask() {
        var config = buildConfigFromOptions(this.options())
          , server = new Server(config)

        this.async()

        server.start()
    }
}

module.exports = devserver