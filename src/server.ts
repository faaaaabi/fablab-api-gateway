import app from './app';
const config = require('config');

const port: number = config.get('API.port');

app.get('/geraete', (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log(`Server started. Listening on port ${port}`);
});
