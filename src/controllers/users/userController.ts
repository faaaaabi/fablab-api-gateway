import notFoundError from '../../http-errors/notFoundError';

const isAllowedToUseMachine = userService => async (req, res, next) => {
  try {
    const isAllowedToUSeMachine: Boolean = await userService.isUserAllowedToUse(
      req.params.uuid,
    );
    if (isAllowedToUSeMachine != null) {
      if (!isAllowedToUSeMachine) {
        res.status('403');
      }
      res.send({ isAllowed: isAllowedToUSeMachine });
    } else {
      next(new notFoundError('User not found', 404));
    }
  } catch (e) {
    next(e);
  }
};

export { isAllowedToUseMachine };
