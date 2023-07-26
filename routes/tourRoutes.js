// Import required modules.
const express = require('express');

// Import the tourController module.
const tourController = require('./../controllers/tourController');

// Create a new router instance.
const router = express.Router();

// Define routes for handling tour-related operations.

// Route for handling GET, PATCH, and DELETE requests on the path '/api/v1/tours/:id'.
router
  .route('/:id')
  .get(tourController.getTour) // Route handler for retrieving a specific tour by ID.
  .patch(tourController.updateTour) // Route handler for updating a specific tour by ID.
  .delete(tourController.deleteTour); // Route handler for deleting a specific tour by ID.

// Route for handling GET and POST requests on the root path '/api/v1/tours'.
router
  .route('/')
  .get(tourController.getAllTours) // Route handler for retrieving all tours.
  .post(tourController.createTour); // Route handler for creating a new tour.

// Export the 'router' object to make it accessible from other modules.
module.exports = router;
