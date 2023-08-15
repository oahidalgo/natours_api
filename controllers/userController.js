const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

// Route handler for retrieving all users.
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //send response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// Route handler for retrieving a specific user by ID.
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};

// Route handler for creating a new user.
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};

// Route handler for updating a specific user by ID.
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};

// Route handler for deleting a specific user by ID.
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};
