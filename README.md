# simplerouter [![Build Status](https://secure.travis-ci.org/karl/simplerouter.png?branch=master)](http://travis-ci.org/karl/simplerouter)

A simple class for routing http webserver requests
Current only supports regex routing.

## Getting Started
Install the module with: `npm install simplerouter`
Define your handler for the request, regex matches will be passed to the function from the third parameter onwards.

```javascript
var simplerouter = require('simplerouter');
var http = require('http');

var someHandler = function(req, res, token) { 
  res.end('Hi, you requested: ' + token);
};

simplerouter.get(/^(.*)$/, someHandler);

var server = http.createServer(simplerouter.requestHandler);
server.listen(8080);
```

## Release History
0.1.0 Initial release with support for regex routing.

## License
Copyright (c) 2014 Karl Stoney  
Licensed under the MIT license.