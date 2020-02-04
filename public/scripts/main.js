const getTask = function() {
  const task = document.createElement('input');
  task.type = 'text';
  task.className = 'task';
  task.id = new Date().valueOf();
  task.onkeypress = addTask;
  task.onkeyup = removeTask;
  return task;
};

const addTask = function(event) {
  if (event.key === 'Enter') {
    const newTodoBox = document.querySelector('.todoAdder');
    newTodoBox.append(getTask());
    newTodoBox.lastChild.focus();
  }
};

const removeTask = function(event) {
  if (event.key === 'Backspace') {
    event.target.previousElementSibling.focus();
    event.target.remove();
  }
};

const createTitleBar = function(titleText) {
  const titleBar = document.createElement('div');
  titleBar.className = 'cardTitleBar';
  const title = document.createElement('p');
  title.innerText = titleText;
  title.className = 'cardTitle';
  titleBar.appendChild(title);
  let deletePng = document.createElement('img');
  deletePng.src = 'images/delete.png';
  deletePng.className = 'deleteLogo';
  deletePng.onclick = deleteTodo;
  titleBar.appendChild(deletePng);
  return titleBar;
};

const createTask = function(taskList, list, id) {
  let taskBar = document.createElement('div');
  taskBar.className = 'taskBar';
  taskBar.onclick = toggleTaskStatus;
  taskBar.id = id;
  const statusLookup = {
    true: 'images/pngwave(1).png',
    false: 'images/pngwave.png'
  };
  const textStyleLookup = {
    false: 'savedTask',
    true: 'taskDone'
  };
  let checkBox = document.createElement('img');
  checkBox.src = statusLookup[list[id].isDone];
  checkBox.className = 'checkBox';
  taskBar.appendChild(checkBox);
  let taskElement = document.createElement('p');
  taskElement.className = textStyleLookup[list[id].isDone];
  taskElement.innerText = list[id].task;
  taskBar.appendChild(taskElement);
  taskList.appendChild(taskBar);
};

const createTaskList = function(list) {
  const taskList = document.createElement('div');
  taskList.className = 'taskList';
  Object.keys(list).forEach(id => {
    createTask(taskList, list, id);
  });
  return taskList;
};

const getHtmlForTodo = function(todo) {
  const card = document.createElement('div');
  card.className = 'todoCard';
  card.id = todo.id;
  const titleBar = createTitleBar(todo.title);
  const taskBar = createTaskList(todo.tasks);
  card.appendChild(titleBar);
  card.appendChild(taskBar);
  return card;
};

const renderTodoAdder = function() {
  const taskInputs = document.getElementsByClassName('task');
  Array.from(taskInputs).forEach(inputBox =>
    inputBox.parentNode.removeChild(inputBox)
  );
  const title = document.getElementById('todoTitle');
  title.value = '';
};

const renderNewTodo = function() {
  renderTodoAdder();
  const todo = JSON.parse(this.responseText);
  const todoList = document.getElementById('todoList');
  const todoHtml = getHtmlForTodo(todo);
  todoList.prepend(todoHtml);
};

const renderTodoList = function() {
  const todos = JSON.parse(this.responseText);
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';
  Object.keys(todos).forEach(todo => {
    const todoHtml = getHtmlForTodo(todos[todo]);
    todoList.prepend(todoHtml);
  });
};

const attachEventListener = function() {
  todoTitle.onkeypress = addTask;
};

const main = function() {
  attachEventListener();
  getTodos();
};
