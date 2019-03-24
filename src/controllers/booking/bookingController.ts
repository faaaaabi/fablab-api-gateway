import { DeviceBookingService } from 'services/deviceBooking/DeviceBookingService';
import { DeviceBooking } from 'entities/DeviceBooking';
import * as jwt from 'jsonwebtoken';
import { ObjectID } from 'bson';
import { intermediateToken } from '../../types/intermediateToken';
const config = require('config');
const jwtSecret: string = config.get('JWT').secret


const bookDevice = (
  deviceBookingService: DeviceBookingService
) => async (req, res, next) => {
  try {
    jwt.verify(req.body.intermediateToken, jwtSecret);
    const bookingID: ObjectID = await deviceBookingService.startBooking(req.body.deviceName, req.body.userUID);
    res.status(201).send({ status: 'OK', bookingID });
  } catch (e) {
    next(e);
  }
};

const endBooking = (deviceBookingService: DeviceBookingService) => async (req, res, next) => {
  try {
    const bookingID: string = req.body.bookingID
    const intermediateToken: intermediateToken = (<any>jwt).verify(req.body.intermediateToken, jwtSecret);
    await deviceBookingService.endBooking(bookingID, intermediateToken.userID);
    res.status(204).send({ status: 'OK' });
  } catch (e) {
    next(e)
  }
}

const getDeviceBooking = (deviceBookingService: DeviceBookingService) => async (req, res, next) => {
  try {
    const deviceIDs = req.query.ids.split(',');
    const deviceBookings: DeviceBooking[] = await deviceBookingService.findBookings(deviceIDs);
    res.status(200).send(deviceBookings);
  } catch (e) {
    next(e);
  }
};

export { bookDevice, endBooking, getDeviceBooking };
