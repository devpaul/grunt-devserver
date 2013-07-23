var path = require('path');

module.exports = function(grunt) {
    initialize()
    loadTasks()
    describeGoals()

    function initialize() {
        var config = require('./Gruntconfig.js')
        grunt.initConfig(config)
    }

    function loadTasks() {
        grunt.loadTasks(path.resolve('tasks'))
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-mocha-test')
    }

    function describeGoals() {
        grunt.registerTask('default', 'devserver')
        grunt.registerTask('e2e', ['jshint', 'unit', 'integration'])
        grunt.registerTask('integration', ['devserver:e2e', 'mochaTest:integration'])
        grunt.registerTask('unit', ['mochaTest:unit'])
        grunt.registerTask('test', 'e2e')
    }
}