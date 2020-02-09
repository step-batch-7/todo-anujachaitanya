const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const { handleRequest } = require('../lib/routers');

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
    const read = sinon.fake.returns(JSON.stringify(data));
    sinon.replace(fs, 'readFileSync', read);
    const write = sinon.fake();
    sinon.replace(fs, 'writeFileSync', write);
  });

  afterEach(() => {
    sinon.restore();
  });
});

describe('GET/', () => {
  it('should return index.html if / is given for path', done => {
    request(handleRequest)
      .get('/')
      .expect('Content-Type', 'text/html')
      .expect(200, done);
  });

  it('should return method not allowed ', done => {
    request(handleRequest)
      .put('/')
      .expect('Content-Type', 'text/html')
      .expect(404, done);
  });
  it('should return css file', done => {
    request(handleRequest)
      .get('/css/style.css')
      .expect('Content-Length', '3977')
      .expect('Content-Type', 'text/css')
      .expect(200, done);
  });

  it('should return png file', done => {
    request(handleRequest)
      .get('/images/save.png')
      .expect('Content-Length', '10513')
      .expect('Content-Type', 'image/png')
      .expect(200, done);
  });

  it('should return js file', done => {
    request(handleRequest)
      .get('/scripts/main.js')
      .expect('Content-Type', 'application/javascript')
      .expect(200, done);
  });

  it('should give not found for bad file ', done => {
    request(handleRequest)
      .get('/scripts/mai.js')
      .expect('Content-Type', 'text/html')
      .expect(404, done);
  });
});

describe('POST /', () => {
  before(() => sinon.replace(fs, 'writeFileSync', () => {}));
  it('should run post method on /saveNewTodo', done => {
    request(handleRequest)
      .post('/saveNewTodo')
      .send({ title: 'anuja', tasks: 'anuja' })
      .expect('Content-Type', 'text/html')
      .expect(200, done);
  });
  after(() => sinon.restore());
});
