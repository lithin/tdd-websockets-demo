// 'use strict';

// describe('server,', function() {
//     var sinon = require('sinon');
//     var expect = require('chai').expect;
//     var http = require('http');
//     var server = require('./server');

//     it('should return a 404 response', function(done) {
//         server().listen(8181);

//         http.get('http://localhost:8181', function(res) {
//             expect(res.statusCode).to.equal(404);
//             done();
//         });
//     });

//     it('should only be created once', function() {
//         var instance = server();
//         instance.nonsense = 'anything';

//         expect(server().nonsense).to.equal('anything');
//     });
// });
