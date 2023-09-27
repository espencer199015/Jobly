"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const JobApplication = require("./jobApplication");

/** Related functions for jobs. */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, company_handle }
   *
   * Returns { id, title, salary, equity, company_handle }
   * */

  static async create({ title, salary, equity, companyHandle }) {
    const result = await db.query(
      `INSERT INTO jobs (title, salary, equity, company_handle)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
      [title, salary, equity, companyHandle]
    );

    const job = result.rows[0];

    if (!job) {
      throw new BadRequestError("Job creation failed");
    }

    return job;
  }

  /** Apply for a job.
   *
   * Returns: true if application successful, false otherwise
   * */

  static async apply(userId, jobId) {
    try {
      await JobApplication.apply(userId, jobId);
      return true;
    } catch (error) {
      // Handle application failure
      return false;
    }
  }

  /** Find all jobs.
   *
   * Returns [{ id, title, salary, equity, company_handle }, ...]
   * */

  static async findAll() {
    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
       FROM jobs`
    );

    return result.rows;
  }

  /** Get a specific job by its ID.
   *
   * Returns { id, title, salary, equity, company_handle }
   * */

  static async get(id) {
    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
       FROM jobs
       WHERE id = $1`,
      [id]
    );

    const job = result.rows[0];

    if (!job) {
      throw new NotFoundError(`Job not found with id: ${id}`);
    }

    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" — it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { title, salary, equity }
   *
   * Returns { id, title, salary, equity, company_handle }
   * */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      title: "title",
      salary: "salary",
      equity: "equity",
      companyHandle: "company_handle",
    });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs
                      SET ${setCols}
                      WHERE id = ${idVarIdx}
                      RETURNING id, title, salary, equity, company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);

    const job = result.rows[0];

    if (!job) {
      throw new NotFoundError(`Job not found with id: ${id}`);
    }

    return job;
  }

  /** Delete a job from the database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM jobs
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    const job = result.rows[0];

    if (!job) {
      throw new NotFoundError(`Job not found with id: ${id}`);
    }
  }
}

module.exports = Job;