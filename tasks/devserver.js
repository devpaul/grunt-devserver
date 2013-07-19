var startServer = require('../lib/commands/startServerCmd.js')
  , loadCompleteOptions = require('../lib/commands/loadCompleteOptionsCmd.js')

function devserver(grunt) {
    grunt.registerTask('devserver', 'Start a static web server.', devServerTask);

    function devServerTask() {
        var options = loadCompleteOptions(this.options())

        if(!options.hasOwnProperty('async') || options.async === true)
            this.async()
        return startServer(options)
    }
}

module.exports = devserver