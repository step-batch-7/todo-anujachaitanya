const getTask = function() {
  const task = document.createElement('input');
  task.type = 'text';
  task.className = 'task';
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
  if (event.key === 'Backspace' && event.target.value === '') {
    const sibling = event.target.previousElementSibling;
    sibling.className === 'todoTitleBar'
      ? document.getElementById('newTitle').focus()
      : sibling.focus();
    event.target.remove();
  }
};

const setEditorForTodo = function(id, editor) {
  const todo = document.getElementById(id);
  const [title, tasks] = Array.from(todo.children);
  const titleBar = document.getElementById('updatedTitle');
  titleBar.value = title.innerText;
  tasks.innerText.split('\n\n').forEach(task => {
    const taskBar = getTask();
    taskBar.value = task;
    editor.appendChild(taskBar);
  });
};

const updateTodo = function(event) {
  const id = event.target.parentNode.parentNode.id;
  const editor = document.getElementById('todoEditor');
  editor.classList.remove('noneDisplay');
  editor.classList.add('todoEditor');
  setEditorForTodo(id, editor);
};

const getTitleElement = function(titleText) {
  const title = document.createElement('p');
  title.innerText = titleText;
  title.className = 'cardTitle';
  return title;
};

const createTitleBar = function(titleText) {
  const titleBar = document.createElement('div');
  titleBar.className = 'cardTitleBar';
  const title = getTitleElement(titleText);
  title.onclick = updateTodo;
  titleBar.appendChild(title);
  const deletePng = document.createElement('img');
  deletePng.className = 'deleteLogo';
  deletePng.onclick = deleteTodo;
  titleBar.appendChild(deletePng);
  return titleBar;
};

const getTaskBarElements = (list, id) => {
  const statusLookup = {
    true: 'images/checked.png',
    false: 'images/unchecked.png'
  };
  const textStyleLookup = {
    false: 'savedTask',
    true: 'taskDone'
  };
  const checkBox = document.createElement('img');
  checkBox.src = statusLookup[list[id].isDone];
  checkBox.className = 'checkBox';
  const taskElement = document.createElement('p');
  taskElement.className = textStyleLookup[list[id].isDone];
  taskElement.innerText = list[id].task;
  return { checkBox, taskElement };
};

const createTask = function(taskList, list, id) {
  const taskBar = document.createElement('div');
  taskBar.className = 'taskBar';
  taskBar.onclick = toggleTaskStatus;
  taskBar.id = id;
  const { checkBox, taskElement } = getTaskBarElements(list, id);
  taskBar.appendChild(checkBox);
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
  const title = document.getElementById('newTitle');
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
  newTitle.onkeypress = addTask;
};

const main = function() {
  attachEventListener();
  getTodos();
};
