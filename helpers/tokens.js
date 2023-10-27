const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// Function: createToken
// Parameters:
// - user: an object representing user data
// Returns: A JSON Web Token (JWT) containing user information
function createToken(user) {
  // Ensure that the 'user' object has the 'isAdmin' property
  console.assert(user.isAdmin !== undefined, "createToken passed user without isAdmin property");

  // Define the payload for the JWT, including 'username' and 'isAdmin' properties
  // Set 'isAdmin' to 'false' if it's not defined in the 'user' object
  let payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  };

  // Generate and return a JWT using the 'payload' and the SECRET_KEY from the config
  return jwt.sign(payload, SECRET_KEY);
}

// Export the 'createToken' function for use in other modules
module.exports = { createToken };