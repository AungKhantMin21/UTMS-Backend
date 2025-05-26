const sendError = (err,res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack
    });
}

module.exports = (err,req,res,next) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;

    sendError(err,res);
}