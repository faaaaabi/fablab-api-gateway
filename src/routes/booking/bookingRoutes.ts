const bookingRoutes = require('express').Router();
import { bookDevice, getBooking, endBooking } from '../../controllers/booking/bookingController';
import DeviceBookingService from '../../services/deviceBooking/DeviceBookingService';

const routes = function(
  deviceBookingService: DeviceBookingService
) {
  bookingRoutes.post('/', bookDevice(deviceBookingService));
  bookingRoutes.get('/:id', getBooking(deviceBookingService));
  bookingRoutes.delete('/:id', endBooking(deviceBookingService));
  return bookingRoutes;
};

export default routes;
