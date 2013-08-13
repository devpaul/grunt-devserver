var startServer = require('../lib/commands/startServerCmd.js')
  , Config = require('../lib/model/Config.js')

function devserver(grunt) {
    grunt.registerMultiTask('devserver', 'Start a static web server.', devServerTask);

    function devServerTask() {
        var config = new Config(this.options())
          , done = this.async()
          , options = this.target ? config.getServer(this.target) : config.getOptions()
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