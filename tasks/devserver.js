var startServer = require('../lib/commands/startServerCmd.js')
  , loadCompleteOptions = require('../lib/commands/loadCompleteOptionsCmd.js')

function devserver(grunt) {
    grunt.registerMultiTask('devserver', 'Start a static web server.', devServerTask);

    function devServerTask() {
        var options = loadCompleteOptions(this.options())
          , done = this.async()
          , promise = startServer(options)

        promise.then(onServerStarted)

        function onServerStarted() {
            if(options.async === false)
                done()
        }

        return promise
    }
}

module.exports = devserver