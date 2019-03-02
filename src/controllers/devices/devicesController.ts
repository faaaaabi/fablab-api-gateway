import DeviceService from 'services/device/DeviceService';
import UserService from 'services/user/UserService';

const toggleDeviceState = (
  deviceService: DeviceService,
  userService: UserService,
) => async (req, res, next) => {
  try {
    console.log('req-body:' + JSON.stringify(req.body));
    if (await userService.isUserAllowedToUse(req.body.userUID)) {
      await deviceService.toggleDeviceState(req.params.deviceName);
      res.send({ status: 'OK' });
    } else {
      res.status(401).send({ status: 'unauthorized' });
    }
  } catch (e) {
    if (e.message.includes('not found')) {
      res.status('404').send({ error: e.message });
    }
    next(e);
  }
};

const getDevicesByGroup = (deviceService: DeviceService) => async (req, res, next) => {
  try {
    const devices = await deviceService.getDevicesByGroup(
      req.params.groupName,
      'position',
    );
    res.send({ devices });
  } catch (e) {
    if (e.message.includes('not found')) {
      res.status('404').send({ error: e.message });
    }
    next(e);
  }
};

const getDevicesByGroupAsLocationMap = (deviceService: DeviceService) => async (
  req,
  res,
  next,
) => {
  try {
    const locationMap = await deviceService.getDevicesByGroupAsLocationMap(
      req.params.groupName,
      'position',
    );
    res.send({ locationMap });
  } catch (e) {
    if (e.message.includes('not found')) {
      res.status('404').send({ error: e.message });
    } else {
      res.status('500').send({ error: `Something went bananas: ${e.message}` });
    }
    next(e);
  }
};

export { toggleDeviceState, getDevicesByGroup, getDevicesByGroupAsLocationMap };
