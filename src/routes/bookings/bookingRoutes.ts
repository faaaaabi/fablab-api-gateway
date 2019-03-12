const bookingRoutes = require('express').Router();
import { bookDevice, getDeviceBooking, endBooking } from '../../controllers/booking/bookingController';
import { DeviceBookingService } from '../../services/deviceBooking/DeviceBookingService';
import UserService from '../../services/user/UserService';
import DeviceService from '../../services/device/DeviceService';

const routes = function(
  deviceBookingService: DeviceBookingService
) {
  bookingRoutes.post('/', bookDevice(deviceBookingService));
  bookingRoutes.get('/', getDeviceBooking(deviceBookingService));
  bookingRoutes.delete('/', endBooking(deviceBookingService));
  return bookingRoutes;
};

export default routes;
