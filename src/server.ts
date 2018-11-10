import app from './app';
const config = require('config');
const userRoutes = require('./routes/user');

const port: number = config.get('API.port');

app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Server started. Listening on port ${port}`);
});
