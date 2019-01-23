import app from './app';

// Load Config & necessary parameters
const config = require('config');
const port: number = config.get('API.port');

// Error Handler
import errorHandler from './middleware/errorHandler'

// Routes
import OdooService from './services/odoo/OdooService';
import userRoutes from './routes/users/userRoutes';
import devicesRoutes from './routes/devices/devicesRoutes';
import authRoutes from './routes/auth/authRoutes';

// Odoo Init
const odooXmlRpc = require('./libs/odoo-xmlrpc');
import OdooClient from './clients/odoo/OdooClient';
const odooService = new OdooService(new OdooClient(new odooXmlRpc(config.get('odoo-client'))));

// OpenHAB init
import OpenhabClient from './clients/openhab/OpenhabClient';
import OpenhabService from './services/openhab/OpenhabService';
const openhabService = new OpenhabService(new OpenhabClient(config.get('openhab-client')));


app.use('/users', userRoutes(odooService));
app.use('/devices', devicesRoutes(openhabService));
app.use('/auth', authRoutes)

// Error handler (Has to be on the end of the "pipeline")
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started. Listening on port ${port}`);
});
