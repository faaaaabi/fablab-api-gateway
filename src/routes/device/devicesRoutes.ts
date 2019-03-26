const devicesRoutes = require('express').Router();
import {
  getDevicesByID
} from '../../controllers/devices/devicesController';
import DeviceService from '../../services/device/DeviceService';

const routes = (deviceService: DeviceService) => {
  devicesRoutes.get('/', getDevicesByID(deviceService));
  return devicesRoutes;
};

export default routes;
