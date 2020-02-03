const getTaskField = function() {
  const task = document.createElement('input');
  task.type = 'text';
  task.className = 'task';
  task.onkeypress = addTaskFieldOnEnter;
  return task;
};

const addTaskFieldOnEnter = function(event) {
  if (event.key === 'Enter') {
    const newTodoBox = document.querySelector('.todoAdder');
    newTodoBox.append(getTaskField());
    newTodoBox.lastChild.focus();
  }
};

const attachEventListener = function() {
  todoTitle.onkeypress = addTaskFieldOnEnter;
};

const main = function() {
  attachEventListener();
};

window.onload = main;
