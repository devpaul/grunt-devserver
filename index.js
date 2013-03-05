var devserver = require('./lib')

if(module.parent == null)
    devserver.commands.startFromConsole()
else
    module.exports = devserver.commands.registerGruntTasks