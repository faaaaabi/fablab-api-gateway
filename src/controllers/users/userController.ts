const isAllowedToUseMachine = odooService => async (req, res, next) => {
  try {
    const isAllowedToUSeMachine : Boolean = await odooService.isUserAllowedToUse(req.params.uuid);
    res.send({ isAllowed : isAllowedToUSeMachine });
  } catch (e) {
    if (e.message === 'User not found') {
      res.status('404')
      .send({ error: 'User not found' });
    }
    next(e);
  }
};

export { isAllowedToUseMachine };
