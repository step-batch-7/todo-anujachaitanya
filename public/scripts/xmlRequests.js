/* eslint-disable no-magic-numbers */
const getTodos = function() {
  sendXmlRequest('GET', undefined, '/index.html', renderTodoList);
};

const parseTodo = function(list) {
  const todoList = [];
  Array.from(list).forEach(todo => todoList.push(todo.value));
  return todoList.join('**');
};

const saveTodo = function() {
  const title = document.getElementById('newTitle').value;
  const tasks = parseTodo(document.getElementsByClassName('task'));
  const data = { title, tasks };
  sendXmlRequest('POST', data, '/saveNewTodo', renderNewTodo);
};

const deleteTask = function(event) {
  const [taskId] = event.target.parentNode.id.split('-');
  const todo = document.getElementsByClassName('editorTasks')[0];
  const [todoId] = todo.id.split('-');
  const data = { taskId, todoId };
  sendXmlRequest('POST', data, '/deleteTask', renderTodoList);
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
  const renderTodos = function(response) {
    resetScreen();
    renderTodoList(response);
  };
  const data = { updatedTitle, tasks, todoId };
  sendXmlRequest('POST', data, '/updateTodo', renderTodos);
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
  const data = { taskId, todoId };
  sendXmlRequest('POST', data, '/toggleTaskStatus', renderTodoList);
};

const deleteTodo = function(event) {
  const id = event.target.parentNode.parentNode.id;
  const data = { id };
  sendXmlRequest('POST', data, '/deleteTodo', renderTodoList);
};

const searchTask = function(event) {
  const task = event.target.value;
  const data = { task };
  sendXmlRequest('POST', data, '/searchTask', renderTodoList);
};

const searchTodo = function(event) {
  const title = event.target.value;
  const data = { title };
  sendXmlRequest('POST', data, '/searchTodo', renderTodoList);
};

const sendXmlRequest = function(method, data, url, callBack) {
  const request = new XMLHttpRequest();
  request.onload = function() {
    callBack(this.responseText);
  };
  request.open(method, url);
  request.send(JSON.stringify(data));
};
