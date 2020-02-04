const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const { app } = require('../lib/handlers');

describe('GET /', () => {
  it('should return index.html if / is given for path', done => {
    request(app.serve.bind(app))
      .get('/')
      .expect('Content-Type', 'text/html')
      .expect(200, done);
  });

  it('should return css file', done => {
    request(app.serve.bind(app))
      .get('/css/style.css')
      .expect('Content-Length', '1993')
      .expect('Content-Type', 'text/css')
      .expect(200, done);
  });

  it('should return png file', done => {
    request(app.serve.bind(app))
      .get('/images/save.png')
      .expect('Content-Length', '18895')
      .expect('Content-Type', 'image/png')
      .expect(200, done);
  });

  it('should return js file', done => {
    request(app.serve.bind(app))
      .get('/scripts/main.js')
      .expect('Content-Type', 'application/javascript')
      .expect(200, done);
  });
});

describe('POST /', () => {
  before(() => sinon.replace(fs, 'writeFileSync', () => {}));
  it('should run post method on /saveNewTodo', done => {
    request(app.serve.bind(app))
      .post('/saveNewTodo')
      .send('title=anuja&tasks=anuja')
      .expect('Content-Type', 'text/html')
      .expect(200, done);
  });
  after(() => sinon.restore());
});
