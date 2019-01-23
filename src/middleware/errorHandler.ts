const errorHandler =(err, req, res, next) => {
      console.error(err);
  
      if (req.app.get('env') !== 'development') {
          delete err.stack;
      }

      res.status(err.statusCode || 500).json(err);
  }

export default errorHandler;