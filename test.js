'use strict';

var HOST = process.env.CONTAINER_IP
var PORT = process.env.CONTAINER_PORT

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('shorthand', function() {
  describe('GET nonexistent key', () => {
      it('it should return 404', (done) => {
        chai.request('http://' + HOST + ':' + PORT)
            .get('/key1')
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });
  });

  describe('POST new key', () => {
      it('it should return status OK', (done) => {
        chai.request('http://' + HOST + ':' + PORT)
            .post('/key2')
            .send('{ "value": "abc123"}')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("status").eql("OK");
              done();
            });
      });
  });

  describe('GET existing key', () => {
      it('it should return the value', (done) => {
        chai.request('http://' + HOST + ':' + PORT)
            .get('/key2')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("value").eql("abc123");
              done();
            });
      });
  });
});
