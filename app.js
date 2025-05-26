const express = require('express')
const dotenv = require('dotenv');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

dotenv.config({path: "./.env"});

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.all('{*splat}', (req,res,next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this Server!`,404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;
