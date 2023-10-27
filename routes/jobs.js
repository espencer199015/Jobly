"use strict";

const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");
const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");

const router = new express.Router();

/** POST / { job } => { job }
 *
 * This route handles the creation of a new job posting.
 * It expects the request body to include data such as title, salary, equity, and companyHandle.
 * It validates the request data against a JSON schema and creates a new job using the Job model.
 * Returns a JSON response containing the newly created job.
 *
 * Authorization required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});

/** POST /apply/:jobId => { applied: jobId }
 *
 * This route allows a user to apply for a job posting.
 * It expects the job's ID as a parameter in the URL, and the user is assumed to be logged in.
 * It then attempts to create an application for the specified job.
 * Returns a JSON response indicating success or failure.
 *
 * Authorization required: logged in user
 */

router.post("/apply/:jobId", ensureLoggedIn, async function (req, res, next) {
  try {
    const jobId = parseInt(req.params.jobId);
    const userId = req.user.id;

    const applicationSuccessful = await Job.apply(userId, jobId);

    if (applicationSuccessful) {
      return res.json({ applied: jobId });
    } else {
      throw new BadRequestError("Application for the job failed");
    }
  } catch (err) {
    return next(err);
  }
});

/** GET / => { jobs: [ { title, salary, equity, companyHandle }, ...] }
 *
 * This route retrieves a list of job postings. It allows for optional filtering by title.
 * If a title filter is provided, it returns job postings matching the title.
 * If no filter is provided, it returns all job postings.
 * Returns a JSON response containing the list of job postings.
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const { title } = req.query;
    let jobs;

    if (title) {
      jobs = await Job.filterJobs(title);
    } else {
      jobs = await Job.findAll();
    }

    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { job }
 *
 * This route retrieves detailed information about a specific job posting using its ID.
 * Returns a JSON response containing the job details.
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { fld1, fld2, ... } => { job }
 *
 * This route allows the updating of job posting details.
 * It expects the ID of the job to be updated in the URL and the fields to be updated in the request body.
 * It validates the request data using a JSON schema and updates the job details using the Job model.
 * Returns a JSON response containing the updated job details.
 *
 * Authorization required: admin
 */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * This route allows the deletion of a job posting by its ID.
 * Returns a JSON response indicating that the job has been deleted.
 *
 * Authorization required: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;