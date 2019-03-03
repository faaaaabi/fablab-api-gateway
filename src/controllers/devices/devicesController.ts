import DeviceService from 'services/device/DeviceService';
import UserService from 'services/user/UserService';
import { DeviceBookingRepository } from 'repositories/DeviceBookingRepository';

const toggleDeviceState = (
  deviceService: DeviceService,
  userService: UserService,
  deviceOccupationRespository: DeviceBookingRepository
) => async (req, res, next) => {
  try {
    if (await userService.isUserAllowedToUse(req.body.userUID)) {
      await deviceService.toggleDeviceState(req.params.deviceName);
      res.send({ status: 'OK' });
    } else {
      res.status(401).send({ status: 'unauthorized' });
    }
  } catch (e) {
    next(e);
  }
};

const getDevicesByGroup = (deviceService: DeviceService) => async (req, res, next) => {
  try {
    const devices = await deviceService.getDevicesByGroup(req.params.groupName, 'position');
    res.send({ devices });
  } catch (e) {
    next(e);
  }
};

const getDevicesByGroupAsLocationMap = (deviceService: DeviceService) => async (req, res, next) => {
  try {
    const locationMap = await deviceService.getDevicesByGroupAsLocationMap(
      req.params.groupName,
      'position'
    );
    res.send({ locationMap });
  } catch (e) {
    next(e);
  }
};

export { toggleDeviceState, getDevicesByGroup, getDevicesByGroupAsLocationMap };
