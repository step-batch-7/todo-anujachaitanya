const { stdout } = require('process');
const { App } = require('./app');
const handlers = require('./handlers');
const app = new App();

app.use(handlers.readBody);
app.use(handlers.requestBodyParser);
app.get('/index.html', handlers.serveTodos);
app.post('/searchTodo', handlers.searchTodo);
app.post('/searchTask', handlers.searchTask);
app.get('/', handlers.serveStaticFile);
app.get('', handlers.notFound);
app.post('/saveNewTodo', handlers.saveNewTodo);
app.post('/toggleTaskStatus', handlers.toggleTaskStatus);
app.post('/updateTodo', handlers.updateTodo);
app.post('/deleteTodo', handlers.deleteTodo);
app.post('/deleteTask', handlers.deleteTask);
app.use(handlers.methodNotAllowed);

const handleRequest = (req, res) => {
  stdout.write(`${req.url}\n`);
  app.serve(req, res);
};

module.exports = { handleRequest };
