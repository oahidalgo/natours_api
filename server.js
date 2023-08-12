const mongoose = require('mongoose');
// Import the 'app' module.
const dotenv = require('dotenv');
//read .env config file and save the env variables to the nodejs process
dotenv.config({ path: './config.env' });
const app = require('./app');
//connect to the Atlas Mongo DB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
// Connect to the MongoDB database
mongoose
  .connect(DB, {
    useNewUrlParser: true, // Use the new MongoDB URL parser
    useCreateIndex: true, // Use createIndex() function to build indexes
    useFindAndModify: false, // Use native MongoDB findOneAndUpdate() and findOneAndRemove() methods instead of deprecated ones
  })
  .then(() => {
    console.log('DB connection successful');
  });

// Define the port for the server.
const port = process.env.PORT || 3000;
// Start the server and listen on the specified port.
const server = app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
