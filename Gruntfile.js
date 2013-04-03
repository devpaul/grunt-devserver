var path = require('path');

module.exports = function(grunt) {
    var config = { devserver: getDevServerConfig()
                 , mochaTest: getMochaTestConfig()
                 , mochaTestConfig: getMochaTestConfigConfig()
                 }

    loadTasks()
    grunt.registerTask('test', ['mochaTest'])
    grunt.initConfig(config)



    function getDevServerConfig() {
        return { port : 4321
               , base : '.'
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

    function loadTasks() {
        grunt.loadTasks(path.resolve('tasks'))
        grunt.loadNpmTasks('grunt-mocha-test')
    }
}