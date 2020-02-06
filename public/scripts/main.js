/* eslint-disable no-magic-numbers */
const getTask = function() {
  const task = document.createElement('input');
  task.type = 'text';
  task.className = 'task';
  task.onkeypress = addTask;
  task.onkeyup = removeTask;
  task.id = Math.floor(Math.random() * 100000);
  return task;
};

const addTask = function(event) {
  if (event.key === 'Enter' && event.target.value !== '') {
    const editor = document.getElementsByClassName('todoEditor')[0];
    const newTodoBox = editor
      ? document.getElementsByClassName('editorTasks')[0]
      : document.querySelector('#todoAdder');
    newTodoBox.append(getTask());
    newTodoBox.lastChild.focus();
  }
};

const removeTask = function(event) {
  if (event.key === 'Backspace' && event.target.value === '') {
    const sibling = event.target.previousElementSibling;
    sibling && sibling.focus();
    event.target.remove();
  }
};

const setEditorForTodo = function(id) {
  const todo = document.getElementById(id);
  const editorTasks = document.getElementsByClassName('editorTasks')[0];
  const [title, tasks] = Array.from(todo.children);
  editorTasks.id = `${id}-editor`;
  const titleBar = document.getElementById('updatedTitle');
  titleBar.value = title.innerText;
  Array.from(tasks.children).forEach(task => {
    const taskBar = getTask();
    taskBar.value = task.innerText;
    taskBar.id = `${task.id}-task`;
    editorTasks.appendChild(taskBar);
  });
};

const setEditor = function(event) {
  const id = event.target.parentNode.parentNode.id;
  const editor = document.getElementById('todoEditor');
  editor.classList.remove('noneDisplay');
  editor.classList.add('todoEditor');
  const container = document.getElementById('container');
  container.classList.add('viewDimmed');
  setEditorForTodo(id);
};

const resetScreen = function() {
  const editor = document.getElementById('todoEditor');
  editor.classList.remove('todoEditor');
  editor.classList.add('noneDisplay');
  const container = document.getElementById('container');
  container.classList.remove('viewDimmed');
  const editorTasks = document.getElementsByClassName('editorTasks')[0];
  editorTasks.innerHTML = '';
};

const getTitleBar = function(title) {
  let html = '<div class="cardTitleBar">';
  html += `<p class="cardTitle" onclick="setEditor(event)">${title}</p>`;
  html += '<img class="deleteLogo" onclick="deleteTodo(event)"/>';
  html += '</div>';
  return html;
};

const createTaskElements = function(list, id) {
  const statusLookup = { true: 'checked', false: 'unchecked' };
  const textStyleLookup = { false: 'savedTask', true: 'taskDone' };
  let html = '<div class="taskBar"';
  html += `id=${id}>`;
  html += `<img class="${
    statusLookup[list[id].isDone]
  }" onclick="toggleTaskStatus(event)">`;
  html += `<p class=${textStyleLookup[list[id].isDone]}>${list[id].task}</p>`;
  html += '</div>';
  return html;
};

const getTaskBars = function(list) {
  let html = '<div class="taskList">';
  const taskHtml = Object.keys(list).map(id => {
    return createTaskElements(list, id);
  });
  html += taskHtml.join('');
  html += '</div>';
  return html;
};

const getCardHtml = function(todo) {
  const titleBar = getTitleBar(todo.title);
  const taskBars = getTaskBars(todo.tasks);
  return titleBar + taskBars;
};

const getHtmlForTodo = function(todo) {
  const card = document.createElement('div');
  card.className = 'todoCard';
  card.id = todo.id;
  card.innerHTML = getCardHtml(todo);
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
  Object.keys(todos)
    .sort()
    .forEach(todo => {
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
