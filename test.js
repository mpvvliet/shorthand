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
            .get('/key/key1')
            .end((err, res) => {
                res.should.have.status(404);
              done();
            });
      });
  });

  var key = "";
  describe('POST new value', () => {
      it('it should return a key', (done) => {
        chai.request('http://' + HOST + ':' + PORT)
            .post('/val/abc123')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("key");
                key = res.body.key;
              done();
            });
      });
  });

  describe('GET existing key', () => {
      it('it should return the value', (done) => {
        chai.request('http://' + HOST + ':' + PORT)
            .get('/key/' + key)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("value").eql("abc123");
              done();
            });
      });
  });
});
