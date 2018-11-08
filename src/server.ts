import app from './app';
import OdooService from './services/odoo/OdooService';
import OdooClient from './clients/odoo/OdooClient';
const config = require('config');
const odooXmlRpc = require('./libs/odoo-xmlrpc');

const port: number = config.get('API.port');

// Service intialization
const odooService = new OdooService(new OdooClient(new odooXmlRpc(config.get('odoo-client'))));

app.get('/user/:uuid/checkMachinePermission', async (req, res) => {
  try {
    const isAllowedToUSeMachine : Boolean = await odooService.isUserAllowedToUse(req.params.uuid);
    res.send({ isAllowed : isAllowedToUSeMachine });
  } catch (e) {
    console.error(e, req.params);
    res.send(e);
  }
});

app.listen(port, () => {
  console.log(`Server started. Listening on port ${port}`);
});
