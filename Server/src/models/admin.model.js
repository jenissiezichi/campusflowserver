import pool from "../configs/db.js";

class Admin {
  static async getAllUsers(universityId) {
    const res = await pool.query("SELECT * FROM users WHERE role = 'student' AND university_id = $1", [universityId]);
    return res.rows;
  }

  static async getStudentsByYear(universityId, year) {
    const shortYear = year.slice(-2);
    const res = await pool.query(
        `SELECT id, fullname, email, matric_number, department 
         FROM users 
         WHERE university = $1 
         AND role = 'student'
         AND matric_number LIKE $2
         ORDER BY matric_number ASC`,
        [universityId, `%/${shortYear}/%`]
    );
    return res.rows;
  }
}

export default Admin;