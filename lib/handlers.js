const fs = require('fs');
const querystring = require('querystring');

const { App } = require('./app');

const CONTENT_TYPES = require('./mimeTypes');
const CODES = require('./statusCodes');

const STATIC_FOLDER = `${__dirname}/../public`;

const getPath = function(url) {
  return url === '/' ? `${STATIC_FOLDER}/index.html` : `${STATIC_FOLDER}${url}`;
};

const getStat = path => {
  return fs.existsSync(path) && fs.statSync(path);
};

const serveStaticFile = (req, res, next) => {
  const path = getPath(req.url);
  const stat = getStat(path);
  if (!stat || !stat.isFile()) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(path);
  res.setHeader('Content-Type', contentType);
  res.end(content);
};

saveNewTodo = (req, res, next) => {
  res.end(req.body.title);
};

const notFound = function(req, res) {
  const content = `File Not Found ${req.url}`;
  const contentType = 'text/html';
  res.writeHead(302, { 'Content-Type': contentType });
  res.end(content);
};

const methodNotAllowed = function(req, res) {
  const content = `Method Not Allowed ${req.method}`;
  const contentType = 'text/html';
  res.writeHead(404, { 'Content-Type': contentType });
  res.end(content);
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data = data + chunk;
  });
  req.on('end', () => {
    req.body = querystring.parse(data);
    next();
  });
};

const app = new App();

app.use(readBody);
app.get('/', serveStaticFile);
app.get('', notFound);
app.post('/saveNewTodo', saveNewTodo);
app.use(methodNotAllowed);

module.exports = { app };
