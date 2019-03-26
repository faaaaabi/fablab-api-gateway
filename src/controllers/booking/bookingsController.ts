import { DeviceBookingService } from 'services/deviceBooking/DeviceBookingService';
import { DeviceBooking } from 'entities/DeviceBooking';
import * as jwt from 'jsonwebtoken';
import { ObjectID } from 'bson';
import { intermediateToken } from '../../types/intermediateToken';
const config = require('config');
const jwtSecret: string = config.get('JWT').secret

const getBookingsByDeviceIDs = (deviceBookingService: DeviceBookingService) => async (req, res, next) => {
  try {
    const bookingIDs = req.query.id;
    const deviceBookings: DeviceBooking[] = await deviceBookingService.findBookings(bookingIDs);
    res.status(200).send(deviceBookings);
  } catch (e) {
    next(e);
  }
};

export { getBookingsByDeviceIDs };
