# Developer Web Server
A simple development web server that serves static content from a directory

## Features
* execute from grunt or command line
* logs requests to console
* no caching of served content
* CORS support header

### Future
* serve up multiple folders
* proxy service

## Usage
### From the Command Line
```
-p, --port (port number) listen on this port
-f, --folder (full path to a folder) serves this folder
```

### From Grunt
In your grunt.js file add this to your grunt configuration:
```
devserver : { 'port' : <port number> (defaults to 8888)
            , 'base' : <directory> (defaults to .)
            }
```

Load the devserver task:
```
grunt.loadNpmTasks(grunt-devserver)
```

and execute using:
```
grunt devserver
```
