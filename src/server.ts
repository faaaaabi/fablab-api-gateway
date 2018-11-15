import app from './app';
import OdooService from './services/odoo/OdooService';
import userRoutes from './routes/users/userRoutes';
import devicesRoutes from './routes/devices/devicesRoutes';

const config = require('config');

// Odoo Init
const odooXmlRpc = require('./libs/odoo-xmlrpc');
import OdooClient from './clients/odoo/OdooClient';
import OpenhabClient from './clients/openhab/OpenhabClient';
import OpenhabService from './services/openhab/OpenhabService';
const odooService = new OdooService(new OdooClient(new odooXmlRpc(config.get('odoo-client'))));

// OpenHAB init
const openhabService = new OpenhabService(new OpenhabClient(config.get('openhab-client')));

const port: number = config.get('API.port');

app.use('/users', userRoutes(odooService));
app.use('/devices', devicesRoutes(openhabService));

app.listen(port, () => {
  console.log(`Server started. Listening on port ${port}`);
});
