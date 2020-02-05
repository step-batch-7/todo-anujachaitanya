const fs = require('fs');
const querystring = require('querystring');

const { App } = require('./app');
const { TodoList } = require('./todoList');

const STATIC_FOLDER = `${__dirname}/../public`;
const DATA_STORE = `${__dirname}/todoLogs.json`;
const logs = fs.readFileSync(DATA_STORE, 'utf8');
const todoLogs = new TodoList(JSON.parse(logs));

const CONTENT_TYPES = require('./mimeTypes');
const CODES = require('./statusCodes');

const getPath = function(url) {
  return url === '/' ? `${STATIC_FOLDER}/index.html` : `${STATIC_FOLDER}${url}`;
};

const getStat = path => {
  return fs.existsSync(path) && fs.statSync(path);
};

const serveStaticFile = (req, res, next) => {
  const path = getPath(req.url);
  const stat = getStat(path);
  if (!stat || !stat.isFile()) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(path);
  res.setHeader('Content-Type', contentType);
  res.end(content);
};

const saveNewTodo = (req, res) => {
  const newTodo = todoLogs.add(req.body);
  const todos = JSON.stringify(todoLogs.todo);
  fs.writeFileSync(DATA_STORE, todos);
  res.setHeader('Content-type', 'text/html');
  res.end(JSON.stringify(newTodo));
};

const serveTodos = function(req, res) {
  const todos = JSON.stringify(todoLogs.todo);
  res.end(todos);
};

const toggleTaskStatus = function(req, res) {
  const { taskId, todoId } = req.body;
  todoLogs.toggleTaskStatus(todoId, taskId);
  const todos = JSON.stringify(todoLogs.todo);
  fs.writeFileSync(DATA_STORE, todos);
  res.end(todos);
};

const deleteTodo = function(req, res) {
  const id = req.body.id;
  delete todoLogs.todoList[id];
  const todos = JSON.stringify(todoLogs.todo);
  res.end(todos);
};

const updateTodo = function(req, res) {
  const { updatedTitle, tasks, todoId } = req.body;
  todoLogs.updateTodo(todoId, tasks, updatedTitle);
  const todos = JSON.stringify(todoLogs.todo);
  fs.writeFileSync(DATA_STORE, todos);
  res.end(todos);
};

const notFound = function(req, res) {
  const content = `File Not Found ${req.url}`;
  const contentType = 'text/html';
  res.writeHead(CODES.FOUND, { 'Content-Type': contentType });
  res.end(content);
};

const methodNotAllowed = function(req, res) {
  const content = `Method Not Allowed ${req.method}`;
  const contentType = 'text/html';
  res.writeHead(CODES.NOT_FOUND, { 'Content-Type': contentType });
  res.end(content);
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data = data + chunk;
  });
  req.on('end', () => {
    req.body = querystring.parse(data);
    next();
  });
};

const app = new App();

app.use(readBody);
app.get('/index.html', serveTodos);
app.get('/', serveStaticFile);
app.get('', notFound);
app.post('/saveNewTodo', saveNewTodo);
app.post('/toggleTaskStatus', toggleTaskStatus);
app.post('/updateTodo', updateTodo);
app.post('/deleteTodo', deleteTodo);
app.use(methodNotAllowed);

module.exports = { app };
