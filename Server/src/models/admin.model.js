import pool from "../configs/db.js";

class Admin {
  static async getAllUsers(universityId) {
    const res = await pool.query("SELECT * FROM users WHERE role = 'student' AND university_id = $1", [universityId]);
    return res.rows;
  }
}

export default Admin;