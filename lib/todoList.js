const generateTasks = function(taskText) {
  let id = Math.floor(Math.random() * 100);
  let tasks = {};
  taskText.forEach(taskText => {
    id += 1;
    return (tasks[id] = { task: taskText, isDone: false });
  });
  return tasks;
};

class Todo {
  constructor(title, tasks) {
    this.title = title;
    this.tasks = { ...tasks };
  }

  static parse(todo) {
    let taskText = todo.tasks.split('**');
    const tasks = generateTasks(taskText);
    return new Todo(todo.title, tasks);
  }
}

class TodoList {
  constructor(todos) {
    this.todoList = { ...todos };
  }

  generateTodoId() {
    const id = Math.ceil(Math.random() * 100000);
    if (Object.keys(this.todoList).includes(id)) this.generateTodoId();
    return id;
  }

  add(todoText) {
    const id = this.generateTodoId();
    const todo = Todo.parse(todoText);
    this.todoList[id] = todo;
    return this.todoList[id];
  }

  get todo() {
    return this.todoList;
  }
}

module.exports = { TodoList };
