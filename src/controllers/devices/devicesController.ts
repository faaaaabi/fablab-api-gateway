const toggleDeviceState = openhabService => async (req, res, next) => {
  try {
    await openhabService.toggleDeviceState(req.params.deviceName);
    res.send({ status: 'OK' });
  } catch (e) {
    if (e.message === 'Device not found') {
      res.status('404')
      .send({ error: e.message });
    }
    next(e);
  }
};

const getDevicesByGroup = openhabService => async (req, res, next) => {
  try {
    const devices = await openhabService.getDevicesByGroup(req.params.groupName);
    res.send({ devices });
  } catch (e) {
    if (e.message === 'Group not found') {
      res.status('404')
      .send({ error: e.message });
    }
    next(e);
  }
};

export { toggleDeviceState, getDevicesByGroup };
