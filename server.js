const mongoose = require('mongoose');
// Import the 'app' module.
const dotenv = require('dotenv');
const app = require('./app');
//read .env config file and save the env variables to the nodejs process
dotenv.config({ path: './config.env' });
//connect to the Atlas Mongo DB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// Connect to the MongoDB database
mongoose
  .connect(DB, {
    useNewUrlParser: true, // Use the new MongoDB URL parser
    useCreateIndex: true, // Use createIndex() function to build indexes
    useFindAndModify: false, // Use native MongoDB findOneAndUpdate() and findOneAndRemove() methods instead of deprecated ones
  })
  .then((con) => {
    console.log('DB connection successful');
  });

// Define the tour schema using Mongoose Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // Name is required, and an error message is provided if missing
    unique: true, // Name must be unique for each tour
  },
  rating: {
    type: Number,
    default: 4.5, // Default rating is set to 4.5 if not provided
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'], // Price is required, and an error message is provided if missing
  },
});

// Create the Tour model based on the tourSchema
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 497,
});
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => console.log('ERROR ', err));

// Define the port for the server.
const port = process.env.PORT || 3000;
// Start the server and listen on the specified port.
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
