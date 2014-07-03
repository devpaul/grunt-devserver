# Developer Web Server
grunt-devserver provides a simple way to quickly get a development server serving up your content with

* run from the command line or Grunt 0.4.x
* no caching content
* CORS headers for cross-domain requests
* logs requests to console
* quickly configure https server
* redefine your middleware in configuration

As a developer I needed a lightweight way to serve up client-side applications and content in isolation from a larger
server application.  Something that supported a rapid workflow and integrated with my tools.

[![Build Status](https://travis-ci.org/devpaul/grunt-devserver.png?branch=master)](https://travis-ci.org/devpaul/grunt-devserver) [![NPM version](https://badge.fury.io/js/grunt-devserver.png)](http://badge.fury.io/js/grunt-devserver)

## Installation
Install it from the command line into your project
```
npm install grunt-devserver --save-dev
```
Or install it globally
```
npm install grunt-devserver -g
```

## Usage
### From the Command Line
Once grunt-devserver has been installed globally you can run it from any folder by typing `devserver`

Command line options:
```
-t, --type (server type) http|https (default is http)
-p, --port (port number) listen on this port
-f, --folder (full path to a folder) serves this folder
-s, --server start a server as defined in the configuration
--cache (method) the method to return in the Cache-Control HTTP header. Default is no-cache.
--file (filename) loads a js/json configuration file
```

For more information on configuration files see [Configuration Files](#configuration)

### From Grunt <a id="grunt"></a>
To start a server through grunt you need a devserver configuration in your `Gruntfile.js` and tell
grunt to load `grunt-devserver` as an available task. For more information see [Configuring Tasks][Grunt Config].
```
    var config = {devserver: {server: {}}}
    grunt.initConfig(config)
    grunt.loadNpmTasks('grunt-devserver')
```

and execute using:
```
    grunt devserver
```

Now you can add the following options:
```
devserver: { options: { 'type' : <string> (http|https defaults to http)
                      , 'port' : <port number> (defaults to 8888)
                      , 'base' : <directory> (defaults to .)
                      , 'cache' : <string> (defaults to 'no-cache')
                      , 'httpsOptions' : <object> https.createServer options
                      , 'file' : <filename>
                      , 'async' : <boolean> (defaults to true)
                      , 'middleware' : <array> || <function> (defaults to predefined middleware)
                      }
           }
```

NOTE: Starting multiple devservers requires setting the `async` option to false so that other server tasks may be
processed.  `async` can also be useful when a server is needed to support integration or functional testing.

See the [Configuration](#configuration) section for more information.

### From Your Project
You can also use devserver directly as a module in your project.

```
    var devserver = require('grunt-devserver')
      , options = { type: "http", port: 8000 }
      , serverStarted = devserver(options)

    serverStarted.then(function(server) {
        // TODO something awesome
    })
```

### From WebStorm
As a developer tool integration is extremely important.  If you are using a Jetbrains IDE like WebStorm
here are instructions to start a devserver directly in your IDE  by adding an entry to your
[External Tools][jbExternalTools]:

1. Go to Preferences > External Tools
1. Click Add
1. Fill in the form:
    1. name: http
    1. group: devserver
    1. program: /usr/local/bin/devserver
    1. paramters: --port $Prompt$
    1. working directory: $FileDir$
1. Hit OK. You should now be able to right-click on any folder and start your devserver!

![WebStorm Usage](./docs/assets/webstorm.png)
<!-- https://github.com/devpaul/grunt-devserver/tree/master/docs/assets/webstorm.png -->

#### Troubleshooting
*Q*: I am getting "`env: node: No such file or directory`"

You need to add node to your path.  On a Mac 10.8.x or later [see launchctl man page][launchctl]
     for more information.

1. From a terminal run ` sudo vim /etc/launchd.conf `
1. Add ` setenv PATH /usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin `
1. Reboot

## Configuration <a id="configuration"></a>
Configuration files provide you with the same functionality as a grunt configuration and can easily be shared across
projects or used from the command-line.

### Options

#### type
The type of server

type: `string`
default: `http`
command line: `-t, --type`

#### port
The port where the server will respond

type: `number`
default: `8888`
command line: `-p, --port`

#### base
The base directory of the web server.  This is where files will be served.  This configuration is passed to the
`serve-index` middleware.

type: `String`
default: `'.'`
command line: `-f, --folder`

#### cache
The type of caching mechanism to use.  The `noCacheHeaders` middleware uses this value to add `Cache-Control`
headers to the HTTP response.

type: `String`
default: `no-cache`
command line: `--cache`

#### httpsOptions
`httpsOptions` are passed directly through to node's https.createServer() method. [Read the docs for more information][nodehttps].
This is ignored unless the server type is specified as `https`.  When a signing certificate is not present, one will be
automatically generated.

type: `object`
default: none

#### file
As external configuration file. See [Using Configuration Files](#configuration) for samples on how to use file
configurations with devserver

type: `string`
default: none
command line: `--file`

#### async
`async` if set to true it will keep Grunt from terminating (see [Grunt Tasks])

type: `boolean`
default: `true`

#### middleware
Redefines the middleware stack to be used by the server.

type: `array` or `function`
default: @see `model/CommonConfig.defaultMiddleware`

Example: redefine the middleware to log the request and send a hello world message
```
{ options: { middleware: [ morgan()
                         , function(req, res, next) {
                            res.send('Hello world!').end(200)
                         }
                         ]
           }
}
```

Routes can also be used to define specific middleware handlers
```
var route = require('devserver').middleware.route
var morgan = require('morgan')

function getName(req, res, next) {
    // retrieve the user name
}

function putName(req, res, next) {
    // update the user name
}

{ options: { middleware: [ morgan()
                         , route('/name/:id').get(getName).put(putName)
                         ]
           }
}
```


### Option Precedence
When a property exists in the grunt/command-line configuration and in the configuration file, the grunt/command-line
option always overrides the file options.

### Example
A example devserverrc file
```
{ "options": { "type" : "http"
             , "port" : 8888
             }
}
```

When this file is loaded from the command-line
```
    devserver --file "./devserverrc" --port 4321 --cache "no-store"
```

The resulting configuration used by devserver
```
{ "options": { "type" : "http"
             , "port" : 4321
             , "cache" : "no-store"
             }
}
```

[nodehttps]: http://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
[launchctl]: http://developer.apple.com/library/mac/#documentation/Darwin/Reference/ManPages/man1/launchctl.1.html
[jbExternalTools]: http://www.jetbrains.com/idea/webhelp/external-tools.html
[Grunt]: http://www.gruntjs.com
[Grunt Tasks]: http://gruntjs.com/api/inside-tasks#this.async
[Grunt Config]: http://gruntjs.com/configuring-tasks
