const { TodoList } = require('../lib/todoList');
const { assert } = require('chai');

describe('TodoList', () => {
  const data = {
    '100': {
      title: 'Neha',
      tasks: {
        '87': { task: 'n', isDone: true },
        '88': { task: 'e', isDone: false },
        '89': { task: 'h', isDone: false }
      },
      id: 100
    }
  };

  describe('generateTodoId', () => {
    it('should give latest id ', () => {
      let todoList = TodoList.parseAllTodos(data);
      todoList = new TodoList(data);
      const id = todoList.generateTodoId();
      assert.strictEqual(id, 101);
    });

    it('should not return undefined as id for undefined data', () => {
      const todoList = new TodoList('');
      const id = todoList.generateTodoId();
      assert.isDefined(id);
    });
  });

  describe('add', () => {
    it('should add todo to given data', () => {
      let todoList = TodoList.parseAllTodos(data);
      todoList = new TodoList(data);
      const newTodo = todoList.add({ title: 'add', tasks: 'a**r**e' });
      assert.strictEqual(newTodo.title, 'add');
    });
  });

  describe('deleteTodo', () => {
    const dataD = {
      '100': {
        title: 'Neha',
        tasks: {
          '87': { task: 'n', isDone: true },
          '88': { task: 'e', isDone: false },
          '89': { task: 'h', isDone: false }
        },
        id: 100
      },
      '101': {
        title: 'Neha',
        tasks: {
          '87': { task: 'n', isDone: true },
          '88': { task: 'e', isDone: false },
          '89': { task: 'h', isDone: false }
        },
        id: 101
      }
    };
    it('should delete the given todo', () => {
      let todoList = TodoList.parseAllTodos(dataD);
      todoList = new TodoList(dataD);
      todoList.deleteTodo('101');
      assert.isUndefined(todoList.todoList['101']);
    });
  });

  it('should return stringified object', () => {
    let todoList = TodoList.parseAllTodos(data);
    todoList = new TodoList(data);
    const string = todoList.toJSON();
    assert.strictEqual(typeof string, 'string');
  });

  describe('search', () => {
    it('should search for given todo title', () => {
      let todoList = TodoList.parseAllTodos(data);
      todoList = new TodoList(data);
      const searched = todoList.search('neha');
      assert.deepStrictEqual(Object.keys(searched), ['100']);
    });

    it('should give total list for empty search', () => {
      let todoList = TodoList.parseAllTodos(data);
      todoList = new TodoList(data);
      const searched = todoList.search('');
      assert.deepStrictEqual(Object.keys(searched), ['100']);
    });

    it('should give nothing if search is not matched', () => {
      let todoList = TodoList.parseAllTodos(data);
      todoList = new TodoList(data);
      const searched = todoList.search('anuja');
      assert.deepStrictEqual(Object.keys(searched), []);
    });
  });
});
