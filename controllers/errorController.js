const AppError = require("../utils/AppError");

const handleDuplicateErrorDB = (err) => {
    const message = `This ${err.meta.target} already exists on ${err.meta.modelName} table`;
    return new AppError(message, 409);
}

const handleValidationError = (err) => {
    const formattedErrors = err.issues.map(e => (e.message));
    return new AppError(formattedErrors.join(' and '), 500);
}

const sendError = (err,res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        detail: err
    });
}

module.exports = (err,req,res,next) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
    let error = JSON.parse(JSON.stringify(err));

        console.log(error);
    if(error.name === 'PrismaClientKnownRequestError'){
        // DUPLICATE DATA ERROR 
        if(error.code === 'P2002'){
            error = handleDuplicateErrorDB(error);
        }
    }

    if(error.name === 'ZodError'){
        // ZOD VALIDATION ERROR
        error = handleValidationError(error);
    }
    

    sendError(error,res);
}