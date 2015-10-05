// 'use strict';

// describe('websocket server,', function() {
//     var sinon = require('sinon');
//     var expect = require('chai').expect;
//     var rewire = require('rewire');
//     var WebSocket = require('websocket').w3cwebsocket;
//     var WebSocketServer = rewire('./websocket-server');
//     var httpServer;
//     var serverStub;
//     var server;
//     var socket;

//     beforeEach(function() {
//         var http;

//         if (!server) {
//             http = require('http');

//             httpServer = http.createServer(function(request, response) {
//                 response.end();
//             });
//             sinon.spy(httpServer, 'listen');
//             serverStub = sinon.stub().returns(httpServer);
//             WebSocketServer.__set__('Server', serverStub);

//             server = WebSocketServer.init();
//         }

//         socket = new WebSocket('ws://localhost:8080', 'plain-text');
//     });

//     afterEach(function() {
//         socket.close();
//     });

//     describe('server', function() {
//         it('hooks itself onto an http server', function() {
//             expect(serverStub.called).to.equal(true);
//         });

//         it('starts listening at http port 8080', function() {
//             expect(httpServer.listen.calledWith(8080)).to.equal(true);
//         });
//     });

//     describe('when it receives a message from client,', function() {
//         it('sends echo of the message back', function(done) {
//             var message = 'This is a message';

//             if (socket.readyState === 1) {
//                 socket.send(message);
//             } else {
//                 socket.onopen = function open() {
//                     socket.send(message);
//                 };
//             }

//             socket.onmessage = function(response) {
//                 expect(response).to.equal(responseMessage);
//                 done();
//             };
//         });
//     });
// });

'use strict';

describe('websocket server:', function() {
    var sinon = require('sinon');
    var expect = require('chai').expect;
    var http = require('http');
    var rewire = require('rewire');
    var WebSocketServer = rewire('./websocket-server');
    var ws = require('websocket');
    var httpServer;
    var httpServerStub;
    var server;

    beforeEach(function() {
        //mock basic server
        httpServer = http.createServer(function(request, response) {
            response.end();
        });
        sinon.spy(httpServer, 'listen');
        httpServerStub = sinon.stub().returns(httpServer);
        WebSocketServer.__set__('Server', httpServerStub);

        //spy on library server
        sinon.spy(ws, 'server');
        WebSocketServer.__set__('WebSocketServer', ws.server);

        server = WebSocketServer.init();
    });

    afterEach(function() {
        ws.server.restore();
        httpServer.close();
    });

    describe('server', function() {
        it('creates http server', function() {
            expect(httpServerStub.called).to.equal(true);
        });

        it('starts listening at port 8080', function() {
            expect(httpServer.listen.calledWith(8080)).to.equal(true);
        });

        it('creates a new WebSocket server on top of the http server', function() {
            expect(ws.server.calledWith({
                httpServer: httpServer
            })).to.equal(true);
        });

        it('gets returned by the init function', function() {
            expect(server).to.include.keys('domain', 'connections', 'pendingRequests', 'config');
        });
    });

    describe('when it receives a message from client,', function() {
        it('sends echo of the message back', function(done) {
            //create a WebSocket
            var socket = new ws.w3cwebsocket('ws://localhost:8080', 'plain-text');
            var message = 'This is the message';

            //send message to server once it's open
            socket.onopen = function open() {
                socket.send(message);
            };

            //check that we then get the same message back
            socket.onmessage = function check(response) {
                expect(response.data).to.equal(message);
                done();
            };
        });
    });
});
