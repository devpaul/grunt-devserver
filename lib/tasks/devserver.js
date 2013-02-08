var server = require('../server.js')

module.exports = function(grunt) {
    grunt.registerTask('devserver', 'Start a static web server.', devServerTask);

    function devServerTask() {
        this.async()

        server(getArgs(grunt))
    }
}

function getArgs(grunt) {
    return { port : grunt.config('devserver.port') || 8888
           , folder : grunt.config('devserver.base') || '.'
           }
}