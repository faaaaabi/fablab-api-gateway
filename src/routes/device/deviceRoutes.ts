const deviceRoute = require('express').Router();
import {
  getDeviceByID,
} from '../../controllers/devices/deviceController';
import DeviceService from '../../services/device/DeviceService';

const routes = (deviceService: DeviceService) => {
  deviceRoute.get('/:deviceID', getDeviceByID(deviceService));
  return deviceRoute;
};

export default routes;
