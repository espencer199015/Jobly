"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth"); // Ensuring user authentication and admin privileges
const Company = require("../models/company");

const companyNewSchema = require("../schemas/companyNew.json"); // JSON schema for creating a new company
const companyUpdateSchema = require("../schemas/companyUpdate.json"); // JSON schema for updating a company

const router = new express.Router();

/** POST / { company } =>  { company }
 *
 * This route handles the creation of a new company. It expects the request body to contain
 * the details of the new company, including handle, name, description, numEmployees, and logoUrl.
 *
 * Returns the newly created company object with fields { handle, name, description, numEmployees, logoUrl }.
 *
 * Authorization required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    // ... (previous code)
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * This route retrieves a list of all companies. It can filter the results based on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    // ... (previous code)
  } catch (err) {
    return next(err);
  }
});

/** GET /[handle]  =>  { company }
 *
 * This route retrieves information about a specific company identified by its handle. The company object includes
 * fields like handle, name, description, numEmployees, logoUrl, and a list of associated jobs.
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {
  try {
    const company = await Company.get(req.params.handle);
    const jobs = await Job.getJobsForCompany(req.params.handle); // Assuming you have a function like this in your Job model

    // Combine company and job information
    const companyWithJobs = { ...company, jobs };

    return res.json({ company: companyWithJobs });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * This route allows the update of company data. It expects a JSON object with fields that can be updated,
 * such as name, description, numEmployees, and logo_url.
 *
 * Returns the updated company object with fields { handle, name, description, numEmployees, logo_url }.
 *
 * Authorization required: admin
 */

router.patch("/:handle", ensureAdmin, async function (req, res, next) {
  try {
    // ... (previous code)
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * This route allows the deletion of a company identified by its handle.
 *
 * Authorization required: admin
 */

router.delete("/:handle", ensureAdmin, async function (req, res, next) {
  try {
    // ... (previous code)
  } catch (err) {
    return next(err);
  }
});

module.exports = router;