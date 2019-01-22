const toggleDeviceState = openhabService => async (req, res, next) => {
  try {
    await openhabService.toggleDeviceState(req.params.deviceName);
    res.send({ status: 'OK' });
  } catch (e) {
    if (e.message.includes('not found')) {
      res.status('404')
      .send({ error: e.message });
    }
    next(e);
  }
};

const getDevicesByGroup = openhabService => async (req, res, next) => {
  try {
    const devices = await openhabService.getDevicesByGroup(req.params.groupName, 'position');
    res.send({ devices });
  } catch (e) {
    if (e.message.includes('not found')) {
      res.status('404')
      .send({ error: e.message });
    }
    next(e);
  }
};

const getDevicesByGroupAsLocationMap = openhabService => async (req, res, next) => {
  try {
    const locationMap = await openhabService.
    getDevicesByGroupAsLocationMap(req.params.groupName, 'position');
    res.send({ locationMap });
  } catch (e) {
    if (e.message.includes('not found')) {
      res.status('404')
      .send({ error: e.message });
    } else {
      res.status('500')
      .send({ error: `Something went bananas: ${e.message}` });
    }
    next(e);
  }
};

export { toggleDeviceState, getDevicesByGroup, getDevicesByGroupAsLocationMap };
