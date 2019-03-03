const deviceRoutes = require('express').Router();
import { toggleDeviceState, getDevicesByGroup, getDevicesByGroupAsLocationMap }
from '../../controllers/devices/devicesController';
import DeviceService from '../../services/device/DeviceService';
import UserService from 'services/user/UserService';

const routes = function (deviceService : DeviceService, userService: UserService, deviceBookingRepository) {
  deviceRoutes.post('/:deviceName/toggleState', toggleDeviceState(deviceService, userService, deviceBookingRepository));
  deviceRoutes.get('/:groupName/members', getDevicesByGroup(deviceService));
  deviceRoutes
  .get('/:groupName/members/locationmap', getDevicesByGroupAsLocationMap(deviceService));
  return deviceRoutes;
};

export default routes;
