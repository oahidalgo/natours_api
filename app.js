// Import required modules.
const express = require('express');
const app = express();
const morgan = require('morgan');

// Import route modules.
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Middleware to log HTTP requests in development mode.
app.use(morgan('dev'));

// Middleware to parse incoming request bodies with JSON format.
// It converts the data into a JSON object and attaches it to the req.body.
app.use(express.json());

// Custom middleware - This middleware will be executed for all routes.
// It logs a message 'Hello from the middleware' in the console.
app.use((req, res, next) => {
  console.log('Hello from the middleware ');
  next();
});

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

// Export the 'app' object to make it accessible from other modules.
module.exports = app;
