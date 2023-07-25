const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan');
const port = 3000;

//Middleware, in the middle of the request and response
//analyze the body of a request with JSON format
//converts the data into a JSON and put it into req.body obj
//1. MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

//order of middleware its very important because of the middleware stack
app.use((req, res, next) => {
  console.log('Hello from the middleware ');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//2. ROUTE HANDLERS
const getAllTours = (req, res) => {
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

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
};

const createTour = (req, res) => {
  //console.log(req.body);
  try {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign(
      {
        id: newId,
      },
      req.body
    );
    tours.push(newTour);

    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
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

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'placeholde',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};
//route handler function
//JSEND standard including results qty
//3. ROUTES
//Mounting a new router on a route

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getTour).patch(updateTour).delete(deleteTour);

tourRouter.route('/:id').get(getAllTours).post(createTour);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//4. START THE SERVER
app.listen(port, () => {
  console.log(`app runing on port ${port}`);
});
