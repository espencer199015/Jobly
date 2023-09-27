"use strict";

const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const JobApplication = require("../models/jobApplication");

const router = new express.Router();

/** POST / { application } => { application }
 *
 * application should be { jobId, userId }
 *
 * Returns { id, jobId, userId, appliedAt }
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
 * Returns all job applications for the specified user
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