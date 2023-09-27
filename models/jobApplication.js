"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

/** Related functions for job applications. */

class JobApplication {
  /** Create a job application (from data), update db, return new job application data.
   *
   * data should be { jobId, userId }
   *
   * Returns { id, jobId, userId, appliedAt }
   */

  static async apply({ jobId, userId }) {
    // Implement the logic to create a new job application in the database
  }

  /** Get all job applications for a user.
   *
   * Returns [{ id, jobId, userId, appliedAt }, ...]
   */

  static async getAllForUser(userId) {
    // Implement the logic to fetch all job applications for a user from the database
  }
}

module.exports = JobApplication;