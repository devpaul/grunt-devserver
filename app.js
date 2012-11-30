var express = require('express')
  , args = getArgs()
  , app = express()

registerMiddleware(app)
startServer(app, args.port)

function getArgs() {
    var o = require('optimist')
    return o.default('port', 8888)
            .default('folder', __dirname)
            .alias('p', 'port')
            .alias('f', 'folder')
            .argv
}

function registerMiddleware(app) {
    app.use(express.logger())
    registerGlobalHeaderOptions(app)
    registerStaticContent(app)
}

function registerStaticContent(app) {
    console.log('serving ' + args.folder)
    var dirOptions = { icons : true }
    app.use(express.directory(args.folder, dirOptions))
    app.use(express.static(args.folder))
}

function registerGlobalHeaderOptions(app) {
    app.use(function(req, res, next) {
        res.setHeader('Cache-Control', 'no-cache')
        next()
    })
}

function startServer(app, port) {
    app.listen(port, function() {
        console.log('listening on ' + port)
    })
}