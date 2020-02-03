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
  return todoList.join('**');
};

const createTitleBar = function(titleText) {
  const titleBar = document.createElement('div');
  titleBar.className = 'cardTitleBar';
  const title = document.createElement('p');
  title.innerText = titleText;
  title.className = 'cardTitle';
  titleBar.appendChild(title);
  return titleBar;
};

const createTaskBar = function(list) {
  const taskBar = document.createElement('div');
  taskBar.className = 'taskList';
  list.forEach(task => {
    let taskElement = document.createElement('p');
    taskElement.className = 'savedTask';
    taskElement.innerText = task;
    taskBar.appendChild(taskElement);
  });
  return taskBar;
};

const getHtmlForTodo = function(todo) {
  const card = document.createElement('div');
  card.className = 'todoCard';
  card.id = todo.id;
  const titleBar = createTitleBar(todo.title);
  const taskBar = createTaskBar(todo.tasks);
  card.appendChild(titleBar);
  card.appendChild(taskBar);
  return card;
};

const renderTodoList = function() {
  const todos = JSON.parse(this.responseText);
  const todoList = document.getElementById('todoList');
  Array.from(todos).forEach(todo => {
    const todoHtml = getHtmlForTodo(todo);
    todoList.prepend(todoHtml);
  });
};

const saveTodo = function() {
  const sendHttpReq = new XMLHttpRequest();
  sendHttpReq.onload = renderTodoList;
  const title = document.getElementById('todoTitle').value;
  const todoList = parseTodo(document.getElementsByClassName('task'));
  sendHttpReq.open('POST', '/saveNewTodo');
  sendHttpReq.send(`title=${title}&tasks=${todoList}`);
};

const attachEventListener = function() {
  todoTitle.onkeypress = addTask;
};

const main = function() {
  attachEventListener();
};

window.onload = main;
