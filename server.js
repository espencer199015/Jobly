"use strict";

// Import the 'app' module, which contains our Express.js application.
const app = require("./app");

// Import the 'PORT' configuration from the 'config' module.
const { PORT } = require("./config");

// Start the server and listen on the specified 'PORT'.
app.listen(PORT, function () {
  // Print a message to the console indicating that the server has started.
  console.log(`Started on http://localhost:${PORT}`);
});