var path = require('path');

module.exports = function(grunt) {
    var config = { devserver : { port : 4321
                               , base : '.'
                               }
                 , mochaTest : { files : ['./test/**/*Test.js'] }
                 , mochaTestConfig : { options : { ui : 'bdd'
                                                 , reporter : 'spec'
                                                 , require : 'test/common'
                                                 }
                              }
                 }

    function loadTasks() {
        grunt.loadTasks(path.resolve('tasks'))
        grunt.loadNpmTasks('grunt-mocha-test')
    }

    loadTasks()
    grunt.registerTask('test', ['mochaTest'])
    grunt.initConfig(config)
}