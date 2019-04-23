import DeviceBookingService from 'services/deviceBooking/DeviceBookingService';
import DeviceBooking from 'entities/DeviceBooking';
const config = require('config');

const getBookingsByDeviceIDs = (deviceBookingService: DeviceBookingService) => async (req, res, next) => {
  try {
    const deviceIDs = req.query.deviceID;
    const deviceBookings: DeviceBooking[] = await deviceBookingService.findBookingsByDeviceID(deviceIDs);
    res.status(200).send(deviceBookings);
  } catch (e) {
    next(e);
  }
};

const getBookings = (deviceBookingService: DeviceBookingService) => async (req, res, next) => {
  try {
    const bookingIDs = req.query.id;
    const deviceBookings: DeviceBooking[] = await deviceBookingService.findBookings(bookingIDs);
    res.status(200).send(deviceBookings);
  } catch (e) {
    next(e);
  }
};

export { getBookingsByDeviceIDs };
