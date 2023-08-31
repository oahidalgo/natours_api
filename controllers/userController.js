const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400,
      ),
    );
  }

  // 2) Update user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Route handler for creating a new user.
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not defined! Please use sign up instead',
  });
};

// Route handler for retrieving a specific user by ID.
exports.getUser = factory.getOne(User);
// Route handler for retrieving all users.
exports.getAllUsers = factory.getAll(User);
//Dont update passwords with this
// Route handler for updating a specific user by ID.
exports.updateUser = factory.updateOne(User);
// Route handler for deleting a specific user by ID.
exports.deleteUser = factory.deleteOne(User);
