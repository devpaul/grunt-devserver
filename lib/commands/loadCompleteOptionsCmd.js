var path = require('path')
  , mergeOptions = require('./mergeOptionsCmd.js')

/**
 * Loads a complete set of configuration options.  If the options passed to the command contains a reference to
 * an options file then options will be loaded and merged with the original options and a new options object
 * is returned representing the full and complete options of the system.
 *
 * NOTE that recursive loading of options files is not supported to maintain simplicity. A strong use case
 * is not apparent for the recursive scenario.
 *
 * @param options the top-level options file
 * @returns Object the flattened representation of all options parameters
 */
function loadCompleteOptionsCmd(options) {
    if(!options || !options.file)
        return options

    return loadAndMergeConfiguration(options)
}

function loadAndMergeConfiguration(options) {
    var optionsFileData

    optionsFileData = loadConfigurationFile(options.file)
    assertConfiguration(optionsFileData)

    return mergeOptions.call(null, optionsFileData.options, options)
}

function assertConfiguration(optionsFileData) {
    if(!optionsFileData || !optionsFileData.options)
        throw new Error('Configuration file does not validate. Could not find an options property.')
}

function loadConfigurationFile(filename) {
    filename = path.resolve(filename)

    return require(filename)
}

module.exports = loadCompleteOptionsCmd