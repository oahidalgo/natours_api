const fs = require('fs');
const mongoose = require('mongoose');
// Import the 'app' module.
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
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

//Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//Import data into db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

//Delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
