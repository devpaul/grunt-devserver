var serverTypes = require('./data/serverTypes.json')
  , underscore = require('underscore')

function HttpConfig() {
    underscore.extend(this, HttpConfig.DEFAULT);
    this.type = serverTypes.HTTP;
}

HttpConfig.DEFAULT = { port: 8888
                     , folder: process.cwd()
                     , cacheControl: 'no-cache'
                     }

module.exports = HttpConfig