/* eslint-disable no-magic-numbers */
const getTodos = function() {
  const xml = new XMLHttpRequest();
  xml.onload = renderTodoList;
  xml.open('GET', '/index.html');
  xml.send();
};

const parseTodo = function(list) {
  const todoList = [];
  Array.from(list).forEach(todo => todoList.push(todo.value));
  return todoList.join('**');
};

const saveTodo = function() {
  const sendHttpReq = new XMLHttpRequest();
  sendHttpReq.onload = renderNewTodo;
  const title = document.getElementById('newTitle').value;
  const tasks = parseTodo(document.getElementsByClassName('task'));
  sendHttpReq.open('POST', '/saveNewTodo');
  title && sendHttpReq.send(JSON.stringify({ title, tasks }));
};

const deleteTask = function(event) {
  const [taskId] = event.target.parentNode.id.split('-');
  const todo = document.getElementsByClassName('editorTasks')[0];
  const [todoId] = todo.id.split('-');
  const xml = new XMLHttpRequest();
  xml.onload = renderTodoList;
  xml.open('POST', '/deleteTask');
  xml.send(JSON.stringify({ taskId, todoId }));
};

const parseTodoForEditor = function(list) {
  const todoList = [];
  Array.from(list).forEach(todo => {
    const [id] = todo.id.split('-');
    const todoText = `${todo.firstChild.value}__${id}`;
    todoList.push(todoText);
  });
  return todoList.join('**');
};

const updateTodo = function() {
  const updatedTitle = document.getElementById('updatedTitle').value;
  const todoEditor = document.getElementsByClassName('editorTasks')[0];
  const [todoId] = todoEditor.id.split('-');
  const [...inputs] = Array.from(todoEditor.children);
  const tasks = parseTodoForEditor(inputs);
  const xml = new XMLHttpRequest();
  xml.onload = function() {
    resetScreen();
    renderTodoList.call({ responseText: this.responseText });
  };
  xml.open('POST', '/updateTodo');
  xml.send(JSON.stringify({ updatedTitle, tasks, todoId }));
};

const getTaskElement = function(path) {
  const [element] = Array.from(path).filter(
    path => path.className === 'taskBar'
  );
  return element;
};

const toggleTaskStatus = event => {
  const element = getTaskElement(event.path);
  const taskId = element.id;
  const todoId = element.parentNode.parentNode.id;
  const xml = new XMLHttpRequest();
  xml.onload = renderTodoList;
  xml.open('POST', '/toggleTaskStatus');
  xml.send(JSON.stringify({ taskId, todoId }));
};

const deleteTodo = function(event) {
  const xml = new XMLHttpRequest();
  xml.onload = renderTodoList;
  xml.open('POST', '/deleteTodo');
  const id = event.target.parentNode.parentNode.id;
  xml.send(JSON.stringify({ id }));
};

const searchTask = function(event) {
  const task = event.target.value;
  const xml = new XMLHttpRequest();
  xml.onload = renderTodoList;
  xml.open('POST', '/searchTask');
  xml.send(JSON.stringify({ task }));
};

const searchTodo = function(event) {
  const title = event.target.value;
  const xml = new XMLHttpRequest();
  xml.onload = renderTodoList;
  xml.open('POST', '/searchTodo');
  xml.send(JSON.stringify({ title }));
};
