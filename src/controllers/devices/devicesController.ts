import UserService from 'services/user/UserService';
import DeviceService from '../../services/device/DeviceService';

const toggleDeviceState = (
  deviceService: DeviceService,
  userService: UserService,
) => async (req, res, next) => {
  try {
    if (await userService.isUserAllowedToUse(req.body.userUID)) {
      await actorService.toggleActorState(req.params.deviceName);
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
