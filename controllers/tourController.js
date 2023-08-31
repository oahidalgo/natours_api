const Tour = require('./../models/tourModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  //Always in a middleware to call the next mw, like a callback
  next();
};

// Controller to get tour statistics
exports.getTourStats = catchAsync(async (req, res, next) => {
  // Perform an aggregation on the Tour collection
  // to calculate specific statistics
  const stats = await Tour.aggregate([
    {
      // Filter tours with ratingsAverage greater than or equal to 4.5
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      // Group tours by their difficulty field and perform aggregation calculations
      $group: {
        _id: { $toUpper: '$difficulty' }, // Group by difficulty in uppercase
        numTours: { $sum: 1 }, // Count the number of tours in each group
        numRatings: { $sum: '$ratingsQuantity' }, // Sum the ratingsQuantity in each group
        avgRating: { $avg: '$ratingsAverage' }, // Calculate the average ratingsAverage in each group
        avgPrice: { $avg: '$price' }, // Calculate the average price in each group
        minPrice: { $min: '$price' }, // Get the minimum value of price in each group
        maxPrice: { $max: '$price' }, // Get the maximum value of price in each group
      },
    },
    {
      // Sort the results based on the average price in ascending order
      $sort: {
        avgPrice: 1,
      },
    },
    // Commented block to filter additional results (if needed)
    /*{
      $match: { _id: { $ne: 'EASY' } },
    },*/
  ]);

  // Return the statistical data in JSON format as a successful response
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// Controller to get the monthly plan for a given year
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // Convert the year parameter to a number
  const year = req.params.year * 1;

  // Perform an aggregation on the Tour collection
  // to calculate the monthly plan for the specified year
  const plan = await Tour.aggregate([
    {
      // Unwind the startDates array, creating a new document for each date
      $unwind: '$startDates',
    },
    {
      // Match documents with startDates within the specified year
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      // Group the documents by month of the startDates
      $group: {
        _id: { $month: '$startDates' }, // Extract the month from the date
        numTourStats: { $sum: 1 }, // Count the number of tours for each month
        tours: { $push: '$name' }, // Create an array of tour names for each month
      },
    },
    {
      // Add a new field 'month' to hold the month extracted from '_id'
      $addFields: {
        month: '$_id',
      },
    },
    {
      // Project to exclude the '_id' field from the result
      $project: {
        _id: 0,
      },
    },
    {
      // Sort the results in descending order based on the number of tours for each month
      $sort: { numTourStats: -1 },
    },
    {
      // Limit the result to only include the top 6 months with the most tours
      $limit: 6,
    },
  ]);

  // Return the monthly plan data in JSON format as a successful response
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

// Route handler for retrieving all tours.
exports.getAllTours = factory.getAll(Tour);
// Route handler for retrieving a specific tour by ID.
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
// Route handler for creating a new tour.
exports.createTour = factory.createOne(Tour);
// Route handler for updating a specific tour by ID.
exports.updateTour = factory.updateOne(Tour);
// Route handler for deleting a specific tour by ID.
exports.deleteTour = factory.deleteOne(Tour);
