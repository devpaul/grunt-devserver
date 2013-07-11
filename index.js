var devserver = require('./lib')

if(module.parent == null)
    devserver.commands.startFromConsole(new devserver.Cli())
else
    module.exports = devserver.commands.registerGruntTasks