const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const { app } = require('../lib/routers');

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
    request(app)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });

  it('should return all the todos', done => {
    request(app)
      .get('/serveTodos')
      .expect(200, done);
  });

  it('should return method not allowed ', done => {
    request(app)
      .put('/')
      .expect('Content-Type', /text\/html/)
      .expect(404, done);
  });

  it('should return css file', done => {
    request(app)
      .get('/css/style.css')
      .expect('Content-Length', '3977')
      .expect('Content-Type', /text\/css/)
      .expect(200, done);
  });

  it('should return png file', done => {
    request(app)
      .get('/images/save.png')
      .expect('Content-Length', '10513')
      .expect('Content-Type', /image\/png/)
      .expect(200, done);
  });

  it('should return js file', done => {
    request(app)
      .get('/scripts/main.js')
      .expect('Content-Type', /application\/javascript/)
      .expect(200, done);
  });

  it('should give not found for bad file ', done => {
    request(app)
      .get('/scripts/mai.js')
      .expect('Content-Type', /text\/html/)
      .expect(404, done);
  });
});

describe('POST / ', () => {
  beforeEach(() => sinon.replace(fs, 'writeFileSync', () => {}));
  afterEach(() => sinon.restore());
  const expectedTitle = new RegExp('anuja');
  it('should run post method on /saveNewTodo', done => {
    request(app)
      .post('/saveNewTodo')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ title: 'anuja', tasks: 'anuja' }))
      .expect(expectedTitle)
      .expect(200, done);
  });

  it('should search given task ', done => {
    const expectedTitle = new RegExp('hii');
    request(app)
      .post('/searchTask')
      .set('Content-Type', 'application/json')
      .send({ task: 'h' })
      .expect(expectedTitle)
      .expect(200, done);
  });

  it('should search given todo', done => {
    const expectedTitle = new RegExp('hii');
    request(app)
      .post('/searchTodo')
      .set('Content-Type', 'application/json')
      .send({ title: 'h' })
      .expect(expectedTitle)
      .expect(200, done);
  });

  it('should toggle status of given todo task', done => {
    const data = { taskId: '87', todoId: '100' };
    const expectedTitle = new RegExp('hii');
    request(app)
      .post('/toggleTaskStatus')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(expectedTitle)
      .expect(200, done);
  });

  it('should updateGiven todo', done => {
    const data = { updatedTitle: 'hey', tasks: '', todoId: '100' };
    const expectedTitle = new RegExp('hey');
    request(app)
      .post('/updateTodo')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(expectedTitle)
      .expect(200, done);
  });

  it('should run post method on /deleteGivenTodo', done => {
    const expectedTitle = new RegExp('hii');
    request(app)
      .post('/deleteTodo')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ id: '100' }))
      .expect(expectedTitle)
      .expect(200, done);
  });

  it('should delete Particular task of given task', done => {
    const expectedTitle = new RegExp('hii');
    request(app)
      .post('/deleteTask')
      .set('Content-Type', 'application/json')
      .send({ todoId: '101', taskId: '46' })
      .expect(expectedTitle)
      .expect(200, done);
  });
});
