import 'dotenv/config';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Application } from 'express';
import app from '../../src/app';

chai.use(chaiHttp);

let server: Application;

describe('API', () => {
  before(async () => {
    server = await app();
  });

  it('should get 404 for /', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        try {
          res.should.have.status(404);
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('should get 404 for /api-doc', (done) => {
    chai
      .request(server)
      .get('/api-doc')
      .end((err, res) => {
        try {
          res.should.have.status(404);
          done();
        } catch (e) {
          done(e);
        }
      });
  });
});
