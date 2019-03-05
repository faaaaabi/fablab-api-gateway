import app from './app';

// Socket IO
const io = require('socket.io')();
const socketioJwt = require('socketio-jwt');

// Load Config & necessary parameters
const config = require('config');
const port: number = config.get('API.port');

// Error Handler
import errorHandler from './middleware/errorHandler';

// Routes
import routes from './routes';
import { RealtimeAccessDevice } from './entities/RealtimeAccessDevice';

(async () => {
  try {
    routes.init(app);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Server started. Listening on port ${port}`);
    });

    io.on(
      'connection',
      socketioJwt.authorize({
        secret: config.get('JWT').secret,
        timeout: 15000,// 15 seconds to send the authentication message
      })
    ).on('authenticated', socket => {
      console.log(`[Realtime API] Device connected ${socket.decoded_token.deviceID}`);
      socket.on('advertise', (payload) => {
        if(payload.accessDeviceName && payload.location) {
          console.log(`Socket id ${socket.id}`);
          console.log(`[Realtime API] Device ${socket.decoded_token.deviceID} advertisement`);
          console.log('payload: ', payload);
          const realtimeAccessDevice = new RealtimeAccessDevice(payload.accessDeviceName, payload.location);
        }
      socket.on('disconnect', () => {
        console.log(`[Realtime API] Device disconnected ${socket.decoded_token.deviceID}`);
      })
      } )
    });

    io.listen(8000);
    console.log('socket.io listening on port 8000');

    process.on( "SIGINT", function() {
      console.log('CLOSING [SIGINT]');
      io.close();
      process.exit();
    } );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
