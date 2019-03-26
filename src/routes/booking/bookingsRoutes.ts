const bookingRoutes = require('express').Router();
import { getBookingsByDeviceIDs } from '../../controllers/booking/bookingsController';
import { DeviceBookingService } from '../../services/deviceBooking/DeviceBookingService';

const routes = function(
  deviceBookingService: DeviceBookingService
) {
  bookingRoutes.get('/', getBookingsByDeviceIDs(deviceBookingService));
  return bookingRoutes;
};

export default routes;
