const userRoutes = require('express').Router();
import { isAllowedToUseMachine } from '../../controllers/users/userController';
import OdooService from 'services/odoo/OdooService';

const routes = function (odooService: OdooService) {
  userRoutes.get('/:uuid/checkMachinePermission', isAllowedToUseMachine(odooService));
  return userRoutes;
};

export default routes;
