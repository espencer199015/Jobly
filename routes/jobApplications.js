"use strict";

const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const JobApplication = require("../models/jobApplication");

const router = new express.Router();

/** POST / { application } => { application }
 *
 * This route handles the creation of a job application.
 * It expects the request body to include an object with jobId and userId.
 * It then validates the request data and creates a job application using the JobApplication model.
 * Returns a JSON response containing the newly created application.
 */

router.post("/", async function (req, res, next) {
  try {
    const { jobId, userId } = req.body;

    // Validate the request data using JSON schema if needed

    const application = await JobApplication.apply({ jobId, userId });
    return res.status(201).json({ application });
  } catch (err) {
    return next(err);
  }
});

/** GET /:userId => { applications: [ { id, jobId, userId, appliedAt }, ...] }
 *
 * This route retrieves all job applications for a specified user.
 * It expects a userId parameter in the URL and uses it to fetch the user's job applications using the JobApplication model.
 * Returns a JSON response containing the array of job applications associated with the user.
 */

router.get("/:userId", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const applications = await JobApplication.getAllForUser(userId);

    return res.json({ applications });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;