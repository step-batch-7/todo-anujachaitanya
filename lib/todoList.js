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
  const updatedTasks = {};
  tasks.forEach(task => {
    const [taskText, id] = task.split('__');
    updatedTasks[id] = { task: taskText };
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

  addNewTask(task) {
    const newId = this.generateNextId();
    this.tasks[newId] = { isDone: false, task: task };
  }

  updateTask(id, task) {
    this.tasks[id].task = task;
  }

  update(tasks, title) {
    this.title = title || this.title;
    const newKeys = Object.keys(tasks);
    newKeys.forEach(id => {
      if (!this.tasks[id]) {
        this.addNewTask(tasks[id].task);
        return;
      }
      this.tasks[id].task !== tasks[id].task &&
        this.updateTask(id, tasks[id].task);
    });
  }

  deleteTask(taskId) {
    delete this.tasks[taskId];
  }

  search(task) {
    return Object.keys(this.tasks).some(id => {
      return this.tasks[id].task.match(task);
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

  deleteTask(todoId, taskId) {
    const todo = this.todoList[todoId];
    todo.deleteTask(taskId);
  }

  search(title) {
    const searchedTodos = {};
    Object.keys(this.todoList).forEach(id => {
      const regex = new RegExp(title, 'gi');
      const matched = this.todoList[id].title.match(regex);
      if (matched) {
        searchedTodos[id] = this.todoList[id];
      }
    });
    return searchedTodos;
  }

  searchTask(task) {
    const searchedTodos = {};
    Object.keys(this.todoList).forEach(id => {
      const regex = new RegExp(task, 'gi');
      const matched = this.todoList[id].search(regex);
      if (matched) {
        searchedTodos[id] = this.todoList[id];
      }
    });
    return searchedTodos;
  }
}

module.exports = { TodoList };
