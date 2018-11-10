const userRoutes = require('express').Router();
const odooXmlRpc = require('../libs/odoo-xmlrpc');
import OdooService from '../services/odoo/OdooService';
import OdooClient from '../clients/odoo/OdooClient';
const config = require('config');

// Service intialization
const odooService = new OdooService(new OdooClient(new odooXmlRpc(config.get('odoo-client'))));

userRoutes.get('/:uuid/checkMachinePermission', async (req, res) => {
  try {
    const isAllowedToUSeMachine : Boolean = await odooService.isUserAllowedToUse(req.params.uuid);
    res.send({ isAllowed : isAllowedToUSeMachine });
  } catch (e) {
    console.error(e, req.params);
    res.send(e);
  }
});

module.exports = userRoutes;
