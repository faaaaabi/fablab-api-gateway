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
    const bookingID = await deviceBookingService.startBooking(req.body.deviceID, req.body.userUID);
    res.status(201).send({ status: 'OK', bookingID });
  } catch (e) {
    next(e);
  }
};

const endBooking = (deviceBookingService: DeviceBookingService) => async (req, res, next) => {
  try {
    const bookingID: string = req.params.id
    const intermediateToken: intermediateToken = (<any>jwt).verify(req.body.intermediateToken, jwtSecret);
    await deviceBookingService.endBooking(bookingID, intermediateToken.userID);
    res.status(200).send({ status: 'OK' });
  } catch (e) {
    next(e)
  }
}

const getBooking = (deviceBookingService: DeviceBookingService) => async (req, res, next) => {
  try {
    const bookingID = req.params.id
    const deviceBookings: DeviceBooking = await deviceBookingService.findBooking(bookingID);
    res.status(200).send(deviceBookings);
  } catch (e) {
    next(e);
  }
};

export { bookDevice, endBooking, getBooking };
