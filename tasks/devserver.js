var startServer = require('../lib/commands/startServerCmd.js')

function devserver(grunt) {
    grunt.registerTask('devserver', 'Start a static web server.', devServerTask);

    function devServerTask() {
        this.async()
        return startServer(this.options())
    }
}

module.exports = devserver