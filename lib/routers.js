const express = require('express');
const app = express();
const handlers = require('./handlers');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.post('/signUp', handlers.signUp);
app.get('/serveTodos', handlers.serveTodos);
app.post('/searchTodo', handlers.searchTodo);
app.post('/searchTask', handlers.searchTask);
app.post('/saveNewTodo', handlers.saveNewTodo);
app.post('/toggleTaskStatus', handlers.toggleTaskStatus);
app.post('/updateTodo', handlers.updateTodo);
app.post('/deleteTodo', handlers.deleteTodo);
app.post('/deleteTask', handlers.deleteTask);

module.exports = { app };
