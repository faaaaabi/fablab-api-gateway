import DeviceService from 'services/device/DeviceService';
import UserService from 'services/user/UserService';
import { DeviceBookingService } from 'services/deviceBooking/DeviceBookingService';
import { DeviceBooking } from 'entities/deviceBooking';
import * as jwt from 'jsonwebtoken';
const config = require('config');
const jwtSecret: string = config.get('JWT').secret

const bookDevice = (
  deviceBookingService: DeviceBookingService
) => async (req, res, next) => {
  try {
    jwt.verify(req.body.intermediateToken, jwtSecret);
    await deviceBookingService.startBooking(req.body.deviceName, req.body.userUID);
    res.status(200).send({ status: 'OK' });
  } catch (e) {
    next(e);
  }
};

const endBooking = (deviceBookingService: DeviceBookingService) => async (req, res, next) => {

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
