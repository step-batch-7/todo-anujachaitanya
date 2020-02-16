const { app } = require('./lib/routers');
const DEFAULT_PORT = 4000;

app.listen(DEFAULT_PORT, () => {
  process.stdout.write('Listening on', DEFAULT_PORT);
});
