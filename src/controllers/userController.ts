const isAllowedToUseMachine = odooService => async (req, res, next) => {
  try {
    const isAllowedToUSeMachine : Boolean = await odooService.isUserAllowedToUse(req.params.uuid);
    res.send({ isAllowed : isAllowedToUSeMachine });
  } catch (e) {
    next(e);
  }
};

export { isAllowedToUseMachine };
