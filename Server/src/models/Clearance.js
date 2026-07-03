import pool from '../configs/db.js';

class Clearance{
  static async getAllStages(universityId) {
    const res = await pool.query
    ('SELECT * FROM clearance_stages WHERE university_id = $1 ORDER BY id ASC', [universityId]);
    return res.rows;
  }

  static async addToClearance({ matricNumber, studentName, stageName, universityId }) {
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await pool.query(
        `INSERT INTO clearance_records (matric_number, student_name, stage_name, university_id, timestamp, is_approved)
         VALUES ($1, $2, $3, $4, $5, null)
         ON CONFLICT (matric_number, stage_name)
         DO UPDATE SET
             student_name = EXCLUDED.student_name,
             timestamp = EXCLUDED.timestamp,
             is_approved = null
         RETURNING *`,
        [matricNumber, studentName, stageName, universityId, timestamp]
    );
    return res.rows[0];
  }

  static async getAll(universityId) {
    const res = await pool.query('SELECT * FROM clearance_records WHERE university_id = $1', [universityId]);
    return res.rows;
  }

}export default Clearance;