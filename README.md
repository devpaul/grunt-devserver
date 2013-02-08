# Developer Web Server
A simple development web server that serves static content from a directory

## Features
* execute from grunt or command line
* logs requests to console
* no caching of served content

### Future
* serve up multiple folders
* CORS support header
* proxy service

## Usage
### From the Command Line
```
-p, --port (port number) listen on this port
-f, --folder (full path to a folder) serves this folder
```

### From Grunt
Add this to your grunt configuration:
```
    devserver : { 'port' : <port number> (defaults to 8888)
                , 'base' : <directory> (defaults to .)
                }
```
And execute using:
```
grunt devserver
```