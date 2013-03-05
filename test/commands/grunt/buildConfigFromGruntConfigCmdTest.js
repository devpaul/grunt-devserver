var buildConfigFromGruntConfigCmd = require('../../../lib/commands/grunt/buildConfigFromGruntConfigCmd.js')
  , Config = require('../../../lib/Config.js')

describe("buildConfigFromGruntConfigCmdTest", function() {
    var configMap, grunt

    beforeEach(function() {
        grunt = { config : getConfig }
        configMap = {}
    })

    function getConfig(name) {
        return configMap[name]
    }

    it("defaults the server port when one is not provided", function() {
        var config = buildConfigFromGruntConfigCmd(grunt)
        expect(config.port).to.be.equal(Config.DEFAULT_PORT)
    })

    it("configures the server port number from grunt", function() {
        var expected = configMap['devserver.port'] = 2468
          , config = buildConfigFromGruntConfigCmd(grunt)
        expect(config.port).to.be.equal(expected)
    })

    it("defaults the folder when one is not provided", function() {
        var config = buildConfigFromGruntConfigCmd(grunt)
        expect(config.folder).to.be.equal(Config.DEFAULT_FOLDER)
    })

    it("configures the folder from grunt", function() {
        var expected = configMap['devserver.base'] = "../"
          , config = buildConfigFromGruntConfigCmd(grunt)
        expect(config.folder).to.be.equal(expected)
    })
})