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

const renderNewTodo = function(responseText) {
  renderTodoAdder();
  const todo = JSON.parse(responseText);
  const todoList = document.getElementById('todoList');
  const todoHtml = getHtmlForTodo(todo);
  todoList.prepend(todoHtml);
};

const renderTodoList = function(responseText) {
  const todos = JSON.parse(responseText);
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';
  Object.keys(todos)
    .sort()
    .forEach(todo => {
      const todoHtml = getHtmlForTodo(todos[todo]);
      todoList.prepend(todoHtml);
    });
};
