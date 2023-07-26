// Import the 'app' module.
const app = require('./app');

// Define the port for the server.
const port = 3000;

// Start the server and listen on the specified port.
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
