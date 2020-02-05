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
  const todoList = parseTodo(document.getElementsByClassName('task'));
  sendHttpReq.open('POST', '/saveNewTodo');
  sendHttpReq.send(`title=${title}&tasks=${todoList}`);
};

const updateTodo = function() {
  const updatedTitle = document.getElementById('updatedTitle');
  const todoEditor = document.getElementById('editorTasks');
  const [title, ...inputs] = Array.from(todoEditor.children);
  const tasks = [];
  inputs.forEach(input => tasks.push(input.value));
  const xml = new XMLHttpRequest();
  xml.onload = function() {
    resetScreen();
    renderTodoList.bind({ responseText: this.responseText });
  };
  xml.open('POST', '/updateTodo');
  xml.send(`updatedTitle=${updatedTitle}&tasks=${tasks}&id=${updatedTitle.id}`);
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
  const sendHttpReq = new XMLHttpRequest();
  sendHttpReq.onload = renderTodoList;
  sendHttpReq.open('POST', '/toggleTaskStatus');
  sendHttpReq.send(`todoId=${todoId}&taskId=${taskId}`);
};

const deleteTodo = function(event) {
  const sendHttpReq = new XMLHttpRequest();
  sendHttpReq.onload = renderTodoList;
  sendHttpReq.open('POST', '/deleteTodo');
  const id = event.target.parentNode.parentNode.id;
  sendHttpReq.send(`id=${id}`);
};
