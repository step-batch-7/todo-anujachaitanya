const getTask = function() {
  const task = document.createElement('input');
  task.type = 'text';
  task.className = 'task';
  task.id = new Date().valueOf();
  task.onkeypress = addTask;
  return task;
};

const addTask = function(event) {
  if (event.key === 'Enter') {
    const newTodoBox = document.querySelector('.todoAdder');
    newTodoBox.append(getTask());
    newTodoBox.lastChild.focus();
  }
};

const parseTodo = function(list) {
  const todoList = [];
  Array.from(list).forEach(todo => todoList.push(todo.value));
  return todoList;
};

const saveTodo = function() {
  const sendHttpReq = new XMLHttpRequest();
  sendHttpReq.onload = function() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = this.responseText;
  };
  const title = document.getElementById('todoTitle').value;
  const todoList = parseTodo(document.getElementsByClassName('task'));
  sendHttpReq.open('POST', '/saveNewTodo');
  sendHttpReq.send(`title=${title}&todoList=${todoList}`);
};

const attachEventListener = function() {
  todoTitle.onkeypress = addTask;
};

const main = function() {
  attachEventListener();
};

window.onload = main;
