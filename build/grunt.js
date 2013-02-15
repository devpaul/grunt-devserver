var path = require('path');

module.exports = function(grunt) {
    function createConfig() {
        var config = {}
        addConnectConfig(config)
        return config
    }

    function addConnectConfig(config) {
        config.devserver = { port : 4322
                           , base : '.'
                           }
    }

    grunt.loadTasks(path.resolve('../'));
    grunt.initConfig(createConfig());
}