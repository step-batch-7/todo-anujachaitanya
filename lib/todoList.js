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

const parseUpdatedTasks = function(tasks) {
  const updatedTasks = [];
  tasks.forEach(task => {
    const [taskText, id] = task.split('__');
    updatedTasks.push({
      task: taskText,
      id
    });
  });
  return updatedTasks;
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

  toggleTaskStatus(taskId) {
    this.tasks[taskId].isDone = !this.tasks[taskId].isDone;
  }

  generateNextId() {
    let [lastId] = Object.keys(this.tasks)
      .sort()
      .reverse();
    return ++lastId || 100;
  }

  update(tasks, title) {
    this.title = title;
    tasks.forEach(task => {
      const previousTask = this.tasks[task.id];
      if (previousTask && previousTask.task !== task.task) {
        previousTask.task = task.task;
        previousTask.isDone = false;
        return;
      }
      task.id = this.generateNextId();
      task.isDone = false;
      !previousTask &&
        (this.tasks[task.id] = {
          task: task.task,
          isDone: task.isDone
        });
    });
  }
}

class TodoList {
  constructor(todos) {
    this.todoList = { ...todos };
  }

  static parseAllTodos(todos) {
    const parsedTodos = {};
    Object.keys(todos).forEach(todoId => {
      const todo = todos[todoId];
      parsedTodos[todoId] = new Todo(todo.title, todo.tasks, todo.id);
    });
    return parsedTodos;
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
    todo.toggleTaskStatus(taskId);
  }

  updateTodo(todoId, tasks, title) {
    const updatedTasks = parseUpdatedTasks(tasks.split('**'));
    this.todoList[todoId].update(updatedTasks, title);
  }
}

module.exports = { TodoList };
