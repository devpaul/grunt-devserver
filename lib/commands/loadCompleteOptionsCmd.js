var path = require('path')
  , mergeOptions = require('./mergeOptionsCmd.js')

function CollisionMap() {
    this.map = {}
}

CollisionMap.prototype.add = function (filename) {
    if(this.map.hasOwnProperty(filename))
        throw new Error('cycle protection triggered by ' + filename)
    this.map[filename] = filename
}


function loadCompleteOptionsCmd(options) {
    var optionsList = loadAllOptionsFiles(options)
    return mergeOptions.apply(null, optionsList)
}


function loadAllOptionsFiles(options) {
    var cycleProtect = new CollisionMap()
      , optionsList = [options]

    while(!!options.file) {
        options = loadOptionsFile(options.file)
        optionsList.push(options)
    }

    return optionsList


    function loadOptionsFile(filename) {
        cycleProtect.add(filename)

        filename = path.resolve(filename)
        return require(filename)
    }
}

module.exports = loadCompleteOptionsCmd