function expectedConfigurationOptions(config) {
    expect(config, 'config undefined').to.exist
    expect(config.type, 'missing configuration type').to.exist
    expect(config.port, 'missing port').to.exist
}

exports.expectedConfigurationOptions = expectedConfigurationOptions