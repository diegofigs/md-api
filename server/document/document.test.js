const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Document APIs', () => {
  let document = {
    name: 'markdown sample',
    contents: '# Markdown Title' +
    '## Markdown Subtitle'
  };

  describe('# POST /api/documents', () => {
    it('should create a new document', (done) => {
      request(app)
        .post('/api/documents')
        .send(document)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(document.name);
          expect(res.body.contents).to.equal(document.contents);
          document = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/documents/:docId', () => {
    it('should get document details', (done) => {
      request(app)
        .get(`/api/documents/${document._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(document.name);
          expect(res.body.contents).to.equal(document.contents);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when document does not exist', (done) => {
      request(app)
        .get('/api/documents/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/documents/:docId', () => {
    it('should update document details', (done) => {
      document.name = 'KK';
      request(app)
        .put(`/api/documents/${document._id}`)
        .send(document)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal('KK');
          expect(res.body.contents).to.equal(document.contents);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/documents/', () => {
    it('should get all documents', (done) => {
      request(app)
        .get('/api/documents')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all documents (with limit and skip)', (done) => {
      request(app)
        .get('/api/documents')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/documents/', () => {
    it('should delete document', (done) => {
      request(app)
        .delete(`/api/documents/${document._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal('KK');
          expect(res.body.contents).to.equal(document.contents);
          done();
        })
        .catch(done);
    });
  });
});
