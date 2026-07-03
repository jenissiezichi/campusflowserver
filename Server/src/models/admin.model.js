import pool from "../configs/db.js";

class Admin {
  static async getAllStudent(universityId) {
    const res = await pool.query("SELECT * FROM users WHERE role = 'student' AND university = $1", [universityId]);
    return res.rows;
  }

    static async getStudentsByLevel(universityId, level) {
        const res = await pool.query(
            `SELECT id, fullname, email, matric_number, department, academic_level 
         FROM users 
         WHERE university = $1 
         AND role = 'student'
         AND academic_level = $2
         ORDER BY fullname ASC`,
            [universityId, level]
        );
        return res.rows;
    }

    static async findByMatricNumber(matricNumber) {
        const res = await pool.query(
            `SELECT * FROM certificates WHERE matric_number = $1 ORDER BY created_at DESC`,
            [matricNumber]
        );
        return res.rows; // returns array — student may have multiple certificates
    }
}

export default Admin;