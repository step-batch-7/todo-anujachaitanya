const fs = require('fs');
const { TODO_STORE } = require('../config');

const { TodoList } = require('./todoList');

const STATIC_FOLDER = `${__dirname}/../public`;
const DATA_STORE = TODO_STORE;

const CONTENT_TYPES = require('./mimeTypes');
const CODES = require('./statusCodes');
const loadTodoLogs = function(DATA_STORE) {
  if (!fs.existsSync(DATA_STORE)) {
    fs.writeFileSync(DATA_STORE, '{}');
  }
  let logs = fs.readFileSync(DATA_STORE, 'utf8');
  logs = TodoList.parseAllTodos(JSON.parse(logs));
  return new TodoList(logs);
};

const todoLogs = loadTodoLogs(DATA_STORE);

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
  fs.writeFileSync(DATA_STORE, todoLogs.toJSON());
  res.setHeader('Content-type', 'text/html');
  res.end(JSON.stringify(newTodo));
};

const deleteTask = function(req, res) {
  const { todoId, taskId } = req.body;
  todoLogs.deleteTask(todoId, taskId);
  fs.writeFileSync(DATA_STORE, todoLogs.toJSON());
  res.setHeader('Status-Code', '200');
  res.end(todoLogs.toJSON());
};

const serveTodos = function(req, res) {
  res.end(todoLogs.toJSON());
};

const toggleTaskStatus = function(req, res) {
  const { taskId, todoId } = req.body;
  todoLogs.toggleTaskStatus(todoId, taskId);
  fs.writeFileSync(DATA_STORE, todoLogs.toJSON());
  res.end(todoLogs.toJSON());
};

const deleteTodo = function(req, res) {
  const id = req.body.id;
  todoLogs.deleteTodo(id);
  res.setHeader('Content-type', 'text/html');
  res.end(todoLogs.toJSON());
};

const updateTodo = function(req, res) {
  const { updatedTitle, tasks, todoId } = req.body;
  todoLogs.updateTodo(todoId, tasks, updatedTitle);
  fs.writeFileSync(DATA_STORE, todoLogs.toJSON());
  res.setHeader('Content-type', 'text/html');
  res.end(todoLogs.toJSON());
};

const searchTodo = function(req, res) {
  const { title } = req.body;
  let searchedTodos = todoLogs.search(title);
  searchedTodos = JSON.stringify(searchedTodos);
  res.setHeader('Content-type', 'text/html');
  res.end(searchedTodos);
};

const searchTask = function(req, res) {
  const { task } = req.body;
  let searchedTodos = todoLogs.searchTask(task);
  searchedTodos = JSON.stringify(searchedTodos);
  res.setHeader('Content-type', 'text/html');
  res.end(searchedTodos);
};

const notFound = function(req, res) {
  const content = `File Not Found ${req.url}`;
  const contentType = 'text/html';
  res.writeHead(CODES.NOT_FOUND, { 'Content-Type': contentType });
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
    req.body = data;
    next();
  });
};

const requestBodyParser = function(req, res, next) {
  if (req.body) {
    req.body = JSON.parse(req.body);
  }
  next();
};

module.exports = {
  readBody,
  requestBodyParser,
  serveTodos,
  searchTodo,
  searchTask,
  notFound,
  serveStaticFile,
  saveNewTodo,
  toggleTaskStatus,
  updateTodo,
  deleteTodo,
  deleteTask,
  methodNotAllowed
};
