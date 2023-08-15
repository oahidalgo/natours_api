//EXPRESS APPLICATION CONFIGURATION
// Import required modules.
const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Import route modules.
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Middleware to log HTTP requests in development mode.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware to parse incoming request bodies with JSON format.
// It converts the data into a JSON object and attaches it to the req.body.
app.use(express.json());
//serve static files
app.use(express.static(`${__dirname}/public`));
// Custom middleware - This middleware will be executed for all routes.
// It logs a message 'Hello from the middleware' in the console.
/*app.use((req, res, next) => {
  console.log('Hello from the middleware ');
  next();
});*/

// Custom middleware - This middleware adds a new property 'requestTime' to the req object.
// The 'requestTime' property is set to the current date and time in ISO string format.
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Mount the 'tourRouter' middleware on the specified path.
// All routes defined in 'tourRouter' will be accessible under '/api/v1/tours'.
app.use('/api/v1/tours', tourRouter);

// Mount the 'userRouter' middleware on the specified path.
// All routes defined in 'userRouter' will be accessible under '/api/v1/users'.
app.use('/api/v1/users', userRouter);

//If a route was not found, a json response will be thrown
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  // next();
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//Error handling middleware
app.use(globalErrorHandler);

// Export the 'app' object to make it accessible from other modules.
module.exports = app;
