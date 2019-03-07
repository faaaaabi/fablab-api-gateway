const bookingRoutes = require('express').Router();
import { bookDevice, getDeviceBooking } from '../../controllers/booking/bookingController';
import { DeviceBookingService } from '../../services/deviceBooking/DeviceBookingService';
import UserService from '../../services/user/UserService';
import DeviceService from '../../services/device/DeviceService';

const routes = function(
  deviceService: DeviceService,
  userService: UserService,
  deviceBookingService: DeviceBookingService
) {
  bookingRoutes.post('/', bookDevice(deviceService, userService, deviceBookingService));
  bookingRoutes.get('/', getDeviceBooking(deviceBookingService));
  return bookingRoutes;
};

export default routes;
