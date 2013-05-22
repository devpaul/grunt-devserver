var Server = require('../lib/controller/Server.js')
  , buildConfigFromOptions = require('../lib/commands/buildConfigFromOptionsCmd.js')

function devserver(grunt) {
    grunt.registerTask('devserver', 'Start a static web server.', devServerTask);

    function devServerTask() {
        var promise = buildConfigFromOptions(this.options())

        this.async()
        return promise.then(onConfigAvailable)
    }

    function onConfigAvailable(config) {
        var server = new Server(config)
        server.start()
    }
}

module.exports = devserver