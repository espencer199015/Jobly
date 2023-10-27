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
    // This function is expected to create a new job application in the database.
    // It should use the provided data, including jobId and userId, and record when the application was made (appliedAt).
  }

  /** Get all job applications for a user.
   *
   * Returns [{ id, jobId, userId, appliedAt }, ...]
   */

  static async getAllForUser(userId) {
    // This function should retrieve all job applications for a specific user from the database.
    // It should return an array of job applications, each containing id, jobId, userId, and appliedAt.
  }
}

module.exports = JobApplication;