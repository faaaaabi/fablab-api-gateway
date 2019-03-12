import UserNotFoundError from '../../errors/UserNotFoundError';

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
      next(new UserNotFoundError('User could not be found'));
    }
  } catch (e) {
    next(e);
  }
};

export { isAllowedToUseMachine };
