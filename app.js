if(module.parent == null)
    require('./lib/console/console.js')
else
    module.exports = require('./lib/tasks/devserver.js')