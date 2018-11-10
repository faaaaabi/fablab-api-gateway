const userRoutes = require('express').Router();
import { isAllowedToUseMachine } from '../controllers/userController';

userRoutes.get('/:uuid/checkMachinePermission', isAllowedToUseMachine);

module.exports = userRoutes;
