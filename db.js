"use strict";
/** Database setup for jobly. */

// Import required modules
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

// Create a database connection based on the environment
if (process.env.NODE_ENV === "production") {
  // For production, connect to the database with SSL settings
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // For development and testing, connect to the database without SSL
  db = new Client({
    connectionString: getDatabaseUri()
  });
}

// Connect to the database
db.connect();

// Export the database connection for use in other parts of the application
module.exports = db;