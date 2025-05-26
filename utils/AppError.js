class AppError extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
          message: this.message,
          statusCode: this.statusCode,
          status: this.status,
          isOperational: this.isOperational,
        };
      }
}


module.exports = AppError;