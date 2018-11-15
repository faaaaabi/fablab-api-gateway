const toggleDeviceState = openhabService => async (req, res, next) => {
  try {
    await openhabService.toggleDeviceState(req.params.deviceName);
    res.send({ status: 'OK' });
  } catch (e) {
    if (e.message === 'Device not found') {
      res.status('404')
      .send({ error: 'Device not found' });
    }
    next(e);
  }
};

export { toggleDeviceState };
