class Todo {
  constructor(title, tasks) {
    this.title = title;
    this.tasks = [...tasks];
    this.isDone = false;
    this.id = new Date().valueOf();
  }

  static parse(todo) {
    const tasks = todo.tasks.split('**');
    return new Todo(todo.title, tasks);
  }
}

class TodoList {
  constructor(todos) {
    this.todos = [...todos];
  }

  add(todoText) {
    const todo = Todo.parse(todoText);
    this.todos.push(todo);
  }

  get todo() {
    return this.todos;
  }
}

module.exports = { TodoList };
