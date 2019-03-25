import DeviceService from '../../services/device/DeviceService';
import { ObjectID } from 'bson';

const getDevicesByID = (deviceService: DeviceService) => async (req, res, next) => {
  try {
    const deviceObjectIDs: ObjectID[] = [];
    if(req.query.id instanceof Array) {
      req.query.id.forEach(deviceID => {
        deviceObjectIDs.push(new ObjectID(deviceID));
      });
    }
    const devices = await deviceService.getDevicesByID(deviceObjectIDs);
    res.send({ devices });
  } catch (e) {
    next(e);
  }
};

export { getDevicesByID };
