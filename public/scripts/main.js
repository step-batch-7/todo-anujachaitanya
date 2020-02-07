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
    const newTodoBox = document.querySelector('#todoAdder');
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

const removeTaskFromEditor = function(event) {
  const sibling = event.target.parentNode.previousSibling.firstChild;
  console.log(sibling);
  sibling && sibling.focus();
  event.target.parentNode.remove();
};

const addTaskOnEditor = function(event) {
  if (event.key === 'Enter' && event.target.value !== '') {
    const newTodoBox = document.getElementsByClassName('editorTasks')[0];
    const id = Math.floor(Math.random() * 100000);
    newTodoBox.appendChild(getEditorTasks({ id, innerText: '' }));
    newTodoBox.lastChild.children[0].focus();
  }
};

const getTaskForEditor = function(value) {
  const task = document.createElement('input');
  task.type = 'text';
  task.className = 'task';
  task.onkeypress = addTaskOnEditor;
  task.value = value;
  return task;
};

const getEditorTasks = function(task) {
  const taskEditor = document.createElement('div');
  taskEditor.className = 'taskBarOnEditor';
  const taskElement = getTaskForEditor(task.innerText);
  taskEditor.appendChild(taskElement);
  taskEditor.id = `${task.id}-task`;
  const deleteLogo = document.createElement('img');
  deleteLogo.className = 'deleteTodo';
  deleteLogo.onclick = event => {
    deleteTask(event);
    removeTaskFromEditor(event);
  };
  taskEditor.appendChild(deleteLogo);
  return taskEditor;
};

const setEditorForTodo = function(id) {
  const todo = document.getElementById(id);
  const editorTasks = document.getElementsByClassName('editorTasks')[0];
  const [title, tasks] = Array.from(todo.children);
  editorTasks.id = `${id}-editor`;
  const titleBar = document.getElementById('updatedTitle');
  titleBar.value = title.innerText;
  Array.from(tasks.children).forEach(task => {
    editorTasks.appendChild(getEditorTasks(task));
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

const attachEventListener = function() {
  newTitle.onkeypress = addTask;
};

const main = function() {
  attachEventListener();
  getTodos();
};
