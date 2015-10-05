'use strict';
var http = require('http');
var server;

module.exports = function() {
    if (!server) {
        server = http.createServer(function(request, response) {
            response.writeHead(404);
            response.end();
        });
    }
    return server;
};
