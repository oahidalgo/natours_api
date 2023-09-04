// Import required modules.
const express = require('express');

// Import the tourController module.
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

// Create a new router instance.
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

// Define routes for handling tour-related operations.
//router.param('id', tourController.checkID);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

// Route for handling GET, PATCH, and DELETE requests on the path '/api/v1/tours/:id'.
router
  .route('/:id')
  .get(tourController.getTour) // Route handler for retrieving a specific tour by ID.
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  ) // Route handler for updating a specific tour by ID.
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  ); // Route handler for deleting a specific tour by ID.

// Route for handling GET and POST requests on the root path '/api/v1/tours'.
router
  .route('/')
  .get(tourController.getAllTours) // Route handler for retrieving all tours.
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  ); // Route handler for creating a new tour.

// Export the 'router' object to make it accessible from other modules.
module.exports = router;
