const deviceRoutes = require('express').Router();
import { toggleDeviceState, getDevicesByGroup } from '../../controllers/devices/devicesController';
import OpenhabService from '../../services/openhab/OpenhabService';

const routes = function (openhabService : OpenhabService) {
  deviceRoutes.get('/:deviceName/toggleState', toggleDeviceState(openhabService));
  deviceRoutes.get('/:groupName/members', getDevicesByGroup(openhabService));
  return deviceRoutes;
};

export default routes;
