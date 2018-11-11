import app from './app';
import OdooService from './services/odoo/OdooService';
import userRoutes from './routes/userRoutes';

const config = require('config');
const odooXmlRpc = require('./libs/odoo-xmlrpc');
import OdooClient from './clients/odoo/OdooClient';
const odooService = new OdooService(new OdooClient(new odooXmlRpc(config.get('odoo-client'))));

const port: number = config.get('API.port');

app.use('/user', userRoutes(odooService));

app.listen(port, () => {
  console.log(`Server started. Listening on port ${port}`);
});
