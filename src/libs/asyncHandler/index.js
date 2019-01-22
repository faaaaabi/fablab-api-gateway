const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (!err.isBoom) {
        return next(boom.badImplementation(err));
      }
      next(err);
    });
  };

export default asyncHandler;