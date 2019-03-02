import app from './app';

// Socket IO
const io = require('socket.io')();
const socketioJwt =  require('socketio-jwt');

// Load Config & necessary parameters
const config = require('config');
const port: number = config.get('API.port');

// Error Handler
import errorHandler from './middleware/errorHandler';

// Routes
import UserService from './services/user/UserService';
import userRoutes from './routes/users/userRoutes';
import devicesRoutes from './routes/devices/devicesRoutes';
import authRoutes from './routes/auth/authRoutes';

// Odoo Init
const odooXmlRpc = require('./libs/odoo-xmlrpc');
import OdooClient from './clients/odoo/OdooClient';
const userService = new UserService(new OdooClient(new odooXmlRpc(config.get('odoo-client'))));

// OpenHAB init
import OpenhabClient from './clients/openhab/OpenhabClient';
import DeviceService from './services/device/DeviceService';
const deviceService = new DeviceService(new OpenhabClient(config.get('openhab-client')));

// Load passport and authentication configuration
const passport = require('passport');
require('./passport');

// Database

/**
 * REST API
 */
app.use('/users', passport.authenticate('jwt', { session: false }),
        userRoutes(userService));
app.use('/devices', passport.authenticate('jwt', { session: false }),
        devicesRoutes(deviceService, userService));
app.use('/auth', authRoutes);

// Error handler (Has to be on the end of the "pipeline")
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started. Listening on port ${port}`);
});

/**
 * SOCKET - REALTIME STUFF
 */
io.on('connection', socketioJwt.authorize({
  secret: config.get('JWT').secret,
  timeout: 15000, // 15 seconds to send the authentication message
})).on('authenticated', (socket) => {
  console.log(`[Realtime API] Device connected ${socket.decoded_token.deviceID}`);
});

io.listen(8000);
console.log('socket.io listening on port 8000');
