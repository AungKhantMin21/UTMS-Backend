const express = require('express')
const dotenv = require('dotenv');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

dotenv.config({path: "./.env"});

const app = express();

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// ROUTES
const userRoutes = require('./routes/userRoutes');

app.use('/api/v1/users', userRoutes);

// GLOBAL ERROR HANDLING
app.all('{*splat}', (req,res,next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this Server!`,404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;
