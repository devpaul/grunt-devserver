var path = require('path');

module.exports = function(grunt) {
    var config = { devserver: getDevServerConfig()
                 , mochaTest: getMochaTestConfig()
                 , mochaTestConfig: getMochaTestConfigConfig()
                 , jshint: getJshintConfig()
                 }

    loadTasks()
    grunt.registerTask('test', ['mochaTest'])
    grunt.initConfig(config)

    function getDevServerConfig() {
        return { port : 4321
               , base : '.'
               , cache : 'no-store'
               }
    }

    function getMochaTestConfig() {
        return { unit: ['./test/unit/**/*Test.js'] }
    }

    function getMochaTestConfigConfig() {
        return { unit: { options: { ui: 'bdd'
                                  , reporter: 'spec'
                                  , require: 'test/unit/common'
                                  }
                       }
               }
    }

    function getJshintConfig() {
        return { options: { jshintrc: '.jshintrc' }
               , all: { src: ['Gruntfile.js', 'lib/**/*.js', 'test/unit/**/*.js'] }
               }
    }

    function loadTasks() {
        grunt.loadTasks(path.resolve('tasks'))
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-mocha-test')
        grunt.registerTask('default', ['jshint', 'test'])
    }
}