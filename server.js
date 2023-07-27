// Import the 'app' module.
const dotenv = require('dotenv');
//read .env config file and save the env variables to the nodejs process
dotenv.config({ path: './config.env' });
const app = require('./app');

// Define the port for the server.
const port = process.env.PORT || 3000;

// Start the server and listen on the specified port.
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
