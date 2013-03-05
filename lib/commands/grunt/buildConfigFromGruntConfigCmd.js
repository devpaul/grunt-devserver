var Config = require('../../Config.js')

function buildConfigFromGruntConfigCmd(grunt) {
    var config = new Config()
    config.port = grunt.config('devserver.port') || config.port
    config.folder = grunt.config('devserver.base') || config.folder
    return config
}

module.exports = buildConfigFromGruntConfigCmd