import DeviceService from '../../services/device/DeviceService';

const getDeviceByID = (deviceService: DeviceService) => async (req, res, next) => {
  try {
    const devices = await deviceService.getDeviceByID(req.params.deviceID);
    res.send({ devices });
  } catch (e) {
    next(e);
  }
};

export { getDeviceByID };
