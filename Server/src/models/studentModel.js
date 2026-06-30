import pool from "../configs/db.js"

class Student {
  static async getAllStudentsFromDB() {
    const res = await pool.query(`SELECT * FROM users WHERE role = 'student' ORDER BY id ASC`);
    return res.rows;
  }
}
export default Student