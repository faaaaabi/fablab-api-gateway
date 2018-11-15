const deviceRoutes = require('express').Router();
import { toggleDeviceState } from '../../controllers/devices/devicesController';
import OpenhabService from '../../services/openhab/OpenhabService';

const routes = function (openhabService : OpenhabService) {
  deviceRoutes.get('/:deviceName/toggleState', toggleDeviceState(openhabService));
  return deviceRoutes;
};

export default routes;
