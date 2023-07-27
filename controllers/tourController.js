// Import the 'fs' module to read/write data to files.
const fs = require('fs');

// Read tours data from 'tours-simple.json' file and parse it into an array.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    //So important to not continue with the send of another json cause
    //its going to fail due to duplicate reponse
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.validateBody = (req, res, next) => {
  const body = req.body;
  const hasProperties = (...props) => props.every((prop) => prop in body);
  if (!hasProperties('name', 'price')) {
    return res.status(400).json({
      status: 'fail',
      message: 'Body doesnt have name or price properties',
    });
  }
  next();
};

// Route handler for retrieving all tours.
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

// Route handler for retrieving a specific tour by ID.
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
};

// Route handler for creating a new tour.
exports.createTour = (req, res) => {
  try {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign(
      {
        id: newId,
      },
      req.body
    );
    tours.push(newTour);

    // Write the updated tour data back to 'tours-simple.json' file.
    fs.writeFile(
      `${__dirname}/../dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status: 'error',
            message: 'Failed to save the tour data.',
          });
        } else {
          res.status(201).json({
            status: 'success',
            data: {
              tour: newTour,
            },
          });
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
};

// Route handler for updating a specific tour by ID.
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'placeholder',
    },
  });
};

// Route handler for deleting a specific tour by ID.
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
