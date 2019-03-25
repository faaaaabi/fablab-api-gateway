import DeviceService from '../../services/device/DeviceService';

const getDeviceByID = (deviceService: DeviceService) => async (req, res, next) => {
  try {
    console.log('req params:', req.params);
    const devices = await deviceService.getDeviceByID(req.params.deviceIDs);
    res.send({ devices });
  } catch (e) {
    next(e);
  }
};

export { getDeviceByID };
