const userRoutes = require('express').Router();
import { isAllowedToUseMachine } from '../../controllers/users/userController';
import UserService from 'services/user/UserService';

const routes = function (odooService: UserService) {
  userRoutes.get('/:uuid/checkMachinePermission', isAllowedToUseMachine(odooService));
  return userRoutes;
};

export default routes;
