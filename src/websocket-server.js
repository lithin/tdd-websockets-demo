var Server = require('./server');
var WebSocketServer = require('websocket').server;

function init() {
    var server = Server().listen(8080);
    var webSocketServer = new WebSocketServer({
        httpServer: server
    });

    webSocketServer.on('request', function(request) {
        var socket = request.accept('plain-text');

        socket.on('message', function(message) {
            socket.sendUTF(message.utf8Data);
        });
    });

    return webSocketServer;
}

module.exports = {
    init: init
};