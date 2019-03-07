import DeviceService from 'services/device/DeviceService';
import UserService from 'services/user/UserService';
import { DeviceBookingService } from 'services/deviceBooking/DeviceBookingService';

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
    const deviceIDs = req.query;
    console.log('request query: ', deviceIDs);
    //await deviceBookingService.findBookings()
  } catch (e) {

  }
};

export { bookDevice, getDeviceBooking };
