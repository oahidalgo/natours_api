// Import required modules.
const express = require('express');

// Import the userController module.
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

// Create a new router instance.
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//protect all the routes after this point
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

//Restrict all the routes after this middleware
router.use(authController.restrictTo('admin'));

// Route for handling GET and POST requests on the root path '/api/v1/users'.
router
  .route('/')
  .get(userController.getAllUsers) // Route handler for retrieving all users.
  .post(userController.createUser); // Route handler for creating a new user.

// Route for handling GET, PATCH, and DELETE requests on the path '/api/v1/users/:id'.
router
  .route('/:id')
  .get(userController.getUser) // Route handler for retrieving a specific user by ID.
  .patch(userController.updateUser) // Route handler for updating a specific user by ID.
  .delete(userController.deleteUser); // Route handler for deleting a specific user by ID.

// Export the 'router' object to make it accessible from other modules.
module.exports = router;
