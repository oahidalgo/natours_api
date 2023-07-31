const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  //Always in a middleware to call the next mw, like a callback
  next();
};

// Route handler for retrieving all tours.
exports.getAllTours = async (req, res) => {
  try {
    //execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Route handler for retrieving a specific tour by ID.
exports.getTour = async (req, res) => {
  try {
    //fn to get specific tour by ID
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Route handler for creating a new tour.
exports.createTour = async (req, res) => {
  try {
    //Creating a new tour in the database
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

// Route handler for updating a specific tour by ID.
exports.updateTour = async (req, res) => {
  try {
    //new flag is gonna return the newly created tour
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

// Route handler for deleting a specific tour by ID.
exports.deleteTour = async (req, res) => {
  try {
    //not send back data on deletion
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

// Controller to get tour statistics
exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    // If an error occurs, return an error message in JSON format
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStats: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStats: -1 },
      },
      {
        $limit: 6,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};
