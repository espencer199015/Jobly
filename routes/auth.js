"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");

/** POST /auth/token:  { username, password } => { token }
 *
 * This route handles user authentication by validating the user's credentials
 * and providing a JSON Web Token (JWT) if authentication is successful.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  try {
    // Validate the request body against the userAuthSchema.
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Extract the username and password from the request body.
    const { username, password } = req.body;

    // Authenticate the user by checking their credentials.
    const user = await User.authenticate(username, password);

    // Generate a JWT token for the authenticated user.
    const token = createToken(user);

    // Return the token as JSON in the response.
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/register:   { user } => { token }
 *
 * This route allows user registration by creating a new user account.
 * The user must provide details like username, password, firstName, lastName, and email.
 * If registration is successful, a JWT token is returned for authentication.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    // Validate the request body against the userRegisterSchema.
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Create a new user account with the provided user details.
    // The user is not an admin by default, so isAdmin is set to false.
    const newUser = await User.register({ ...req.body, isAdmin: false });

    // Generate a JWT token for the newly registered user.
    const token = createToken(newUser);

    // Return the token as JSON in the response with a status code of 201 (Created).
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;