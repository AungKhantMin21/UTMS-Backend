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
const taskTypeRoutes = require('./routes/taskTypeRoutes');
const featureRoutes = require('./routes/featureRoutes');
const subTaskTypeRoutes = require('./routes/subTaskTypeRoutes');

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/task-types', taskTypeRoutes);
app.use('/api/v1/features', featureRoutes);
app.use('/api/v1/sub-task-types', subTaskTypeRoutes);

// GLOBAL ERROR HANDLING
app.all('{*splat}', (req,res,next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this Server!`,404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;
