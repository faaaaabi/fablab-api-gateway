const notFoundError = function(message, errorCode) {

    Error.captureStackTrace(this, this.constructor);
  
    this.error = this.constructor.name;
    this.message = message || 'The requested resource couldn\'t be found';
    this.statusCode = 404;
    this.errorCode = errorCode || 404;
  };

export default notFoundError;