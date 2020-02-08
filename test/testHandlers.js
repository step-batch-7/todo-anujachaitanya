const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const { app } = require('../lib/handlers');

describe('GET /', () => {
  beforeEach(() => {
    const data = {
      '104': {
        title: 'Ragini',
        tasks: { '12': { task: 'hey', isDone: true } },
        id: 104
      },
      '105': {
        title: 'Ragini',
        tasks: { '12': { task: 'hey', isDone: true } },
        id: 104
      }
    };

  afterEach(() => {
    sinon.restore();
  });
});

describe('GET/', () => {
  it('should return index.html if / is given for path', done => {
    request(app.serve.bind(app))
      .get('/')
      .expect('Content-Type', 'text/html')
      .expect(200, done);
  });

  it('should return method not allowed ', done => {
    request(app.serve.bind(app))
      .put('/')
      .expect('Content-Type', 'text/html')
      .expect(404, done);
  });

  it('should return css file', done => {
    request(app.serve.bind(app))
      .get('/css/style.css')
      .expect('Content-Length', '3977')
      .expect('Content-Type', 'text/css')
      .expect(200, done);
  });

  it('should return png file', done => {
    request(app.serve.bind(app))
      .get('/images/save.png')
      .expect('Content-Length', '10513')
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
