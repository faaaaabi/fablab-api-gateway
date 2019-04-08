import app from './app';

// Load Config & necessary parameters
const config = require('config');
const port: number = config.get('API.port');

// Error Handler
import errorHandler from './middleware/errorHandler';

// Routes
import routes from './routes';

(async () => {
  try {
    await routes.init(app);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Server started. Listening on port ${port}`);
    });

    process.on('SIGINT', function() {
      console.log('CLOSING [SIGINT]');
      process.exit();
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
