import DeviceService from '../../services/device/DeviceService';

const getDeviceByID = (deviceService: DeviceService) => async (req, res, next) => {
  try {
    const device = await deviceService.getDeviceByID(req.params.deviceID);
    res.send({ device });
  } catch (e) {
    next(e);
  }
};

export { getDeviceByID };
