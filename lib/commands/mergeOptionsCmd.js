var _ = require('underscore')

function mergeOptionsCmd() {
    var options = {}
      , max = arguments.length
      , i

    for(i = 0; i < max; i++)
        mergeOptions(options, arguments[i])

    return options
}

function mergeOptions(target, source) {
    _.extend(target, source)
}

module.exports = mergeOptionsCmd