var path = require('path');

module.exports = function(grunt) {
    var config = { devserver: getDevServerOptions()
                 , mochaTest: getMochaTestOptions()
                 , mochaTestConfig: getMochaTestConfigOptions()
                 , jshint: getJshintOptions()
                 }

    loadTasks()
    grunt.initConfig(config)


    function getDevServerOptions() {
        return { options: { type : 'https'     // the server protocol (default http)
                          , port : 8888        // the server port to listen on
                          , base : '.'         // the base folder to serve files
                          , cache : 'no-store' // http caching method (defaults to 'no-cache')
                          }
               }
    }

    function getMochaTestOptions() {
        return { unit: ['./test/unit/**/*Test.js']
               , integration: ['./test/integration/**/*Test.js']
               }
    }

    function getMochaTestConfigOptions() {
        return { options: { ui: 'bdd'
                          , reporter: 'spec'
                          , noColors: true
                          , require: 'test/common'
                          }
               }
    }

    function getJshintOptions() {
        return { options: { jshintrc: '.jshintrc' }
               , all: { src: ['Gruntfile.js', 'lib/**/*.js', 'test/unit/**/*.js', 'test/integration/**/*.js'] }
               }
    }

    function loadTasks() {
        grunt.loadTasks(path.resolve('tasks'))
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-mocha-test')
        grunt.registerTask('default', ['jshint', 'test'])
        grunt.registerTask('e2e', ['jshint', 'mochaTest'])
        grunt.registerTask('test', ['mochaTest:unit'])
    }
}