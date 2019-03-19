const errorHandler =(err, req, res, next) => {
      let responseCode;
      console.error(err);

      if (req.app.get('env') !== 'development') {
          delete err.stack;
      }

      switch (err.constructor.name) {
        case 'UserNotFoundError':
          responseCode = 404;
          break;
        case 'DeviceNotFoundError':
          responseCode = 404;
          break;
        case 'DeviceStateError':
          responseCode = 500;
          break;
        case 'TokenExpiredError':
          responseCode = 401;
          break;
        case 'UnauthorizedError':
          responseCode = 401;
          break;
        default:
          responseCode = 500;
          break;
      }

      res.status(responseCode).json({error: err.message});
  }

export default errorHandler;