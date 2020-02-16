const fs = require('fs');
const { TODO_STORE } = require('../config');

const { TodoList } = require('./todoList');

const DATA_STORE = TODO_STORE;

const loadTodoLogs = function(DATA_STORE) {
  if (!fs.existsSync(DATA_STORE)) {
    fs.writeFileSync(DATA_STORE, '{}');
  }
  let logs = fs.readFileSync(DATA_STORE, 'utf8');
  logs = TodoList.parseAllTodos(JSON.parse(logs));
  return new TodoList(logs);
};

const todoLogs = loadTodoLogs(DATA_STORE);

const saveNewTodo = (req, res, next) => {
  if (!req.body) {
    return next();
  }
  const newTodo = todoLogs.add(req.body);
  fs.writeFileSync(DATA_STORE, todoLogs.toJSON());
  res.setHeader('Content-type', 'text/html');
  res.end(JSON.stringify(newTodo));
};

const deleteTask = function(req, res, next) {
  const { todoId, taskId } = req.body;
  if (!(todoId && taskId)) {
    return next();
  }
  todoLogs.deleteTask(todoId, taskId);
  fs.writeFileSync(DATA_STORE, todoLogs.toJSON());
  res.setHeader('Status-Code', '200');
  res.end(todoLogs.toJSON());
};

const serveTodos = function(req, res) {
  res.end(todoLogs.toJSON());
};

const toggleTaskStatus = function(req, res, next) {
  const { taskId, todoId } = req.body;
  if (!(taskId && todoId)) {
    return next();
  }
  todoLogs.toggleTaskStatus(todoId, taskId);
  fs.writeFileSync(DATA_STORE, todoLogs.toJSON());
  res.end(todoLogs.toJSON());
};

const deleteTodo = function(req, res, next) {
  const id = req.body.id;
  if (!id) {
    return next();
  }
  todoLogs.deleteTodo(id);
  res.setHeader('Content-type', 'application/json');
  res.end(todoLogs.toJSON());
};

const updateTodo = function(req, res, next) {
  const { updatedTitle, tasks, todoId } = req.body;
  if (!todoId) {
    return next();
  }
  todoLogs.updateTodo(todoId, tasks, updatedTitle);
  fs.writeFileSync(DATA_STORE, todoLogs.toJSON());
  res.setHeader('Content-type', 'application/json');
  res.end(todoLogs.toJSON());
};

const searchTodo = function(req, res, next) {
  const { title } = req.body;
  if (!title) {
    return next();
  }
  let searchedTodos = todoLogs.search(title);
  searchedTodos = JSON.stringify(searchedTodos);
  res.setHeader('Content-type', 'application/json');
  res.end(searchedTodos);
};

const searchTask = function(req, res, next) {
  const { task } = req.body;
  if (!task) {
    return next();
  }
  let searchedTodos = todoLogs.searchTask(task);
  searchedTodos = JSON.stringify(searchedTodos);
  res.setHeader('Content-type', 'application/json');
  res.end(searchedTodos);
};

module.exports = {
  serveTodos,
  searchTodo,
  searchTask,
  saveNewTodo,
  toggleTaskStatus,
  updateTodo,
  deleteTodo,
  deleteTask
};
