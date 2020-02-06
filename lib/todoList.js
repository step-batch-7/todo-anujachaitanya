/* eslint-disable no-magic-numbers */
const generateTasks = function(taskText) {
  let id = Math.floor(Math.random() * 100);
  const tasks = {};
  taskText.forEach(taskText => {
    id += 1;
    tasks[id] = { task: taskText, isDone: false };
  });
  return tasks;
};

class Todo {
  constructor(title, tasks, id) {
    this.title = title;
    this.tasks = { ...tasks };
    this.id = id;
  }

  static parseNewTodo(todo, id) {
    const taskText = todo.tasks.split('**');
    const tasks = generateTasks(taskText);
    return new Todo(todo.title, tasks, id);
  }
}

class TodoList {
  constructor(todos) {
    this.todoList = { ...todos };
  }

  generateTodoId() {
    let [lastId] = Object.keys(this.todoList)
      .sort()
      .reverse();
    return ++lastId || 100;
  }

  add(todoText) {
    const id = this.generateTodoId();
    const todo = Todo.parseNewTodo(todoText, id);
    this.todoList[id] = todo;
    return this.todoList[id];
  }

  get todo() {
    return this.todoList;
  }

  toggleTaskStatus(todoId, taskId) {
    const todo = this.todoList[todoId];
    todo.tasks[taskId].isDone = !todo.tasks[taskId].isDone;
  }

  updateTodo(todoId, tasks, title) {
    const todo = Todo.parseNewTodo({ title, tasks }, todoId);
    this.todoList[todoId] = todo;
  }
}

module.exports = { TodoList };
