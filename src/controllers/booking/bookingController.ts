import DeviceService from 'services/device/DeviceService';
import UserService from 'services/user/UserService';
import { DeviceBookingService } from 'services/deviceBooking/DeviceBookingService';
import { DeviceBooking } from 'entities/deviceBooking';

const bookDevice = (
  deviceService: DeviceService,
  userService: UserService,
  deviceBookingService: DeviceBookingService
) => async (req, res, next) => {
  try {
    await deviceBookingService.startBooking(req.body.deviceName, req.body.userUID);
    res.status(200).send({ status: 'OK' });
  } catch (e) {
    next(e);
  }
};

const getDeviceBooking = (deviceBookingService: DeviceBookingService) => async (req, res, next) => {
  try {
    const deviceIDs = req.query.ids.split(',');
    const deviceBookings: DeviceBooking[] = await deviceBookingService.findBookings(deviceIDs);
    res.status(200).send(deviceBookings);
  } catch (e) {
    next(e);
  }
};

export { bookDevice, getDeviceBooking };
