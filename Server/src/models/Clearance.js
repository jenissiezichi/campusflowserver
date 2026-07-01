import pool from '../configs/db.js';

class Clearance{
  static async getAllStages(universityId) {
    const res = await pool.query
    ('SELECT * FROM clearance_stages WHERE university_id = $1 ORDER BY id ASC', [universityId]);
    return res.rows;
  }
}export default Clearance;