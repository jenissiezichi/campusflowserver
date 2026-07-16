import pool from "../configs/db.js";

class SuperAdmin {
  static async getAllStudents() {
    const res = await pool.query("SELECT * FROM users WHERE role = 'student'");
    return res.rows;
  }
  static async getAllAdmins() {
    const res = await pool.query("SELECT * FROM users WHERE role = 'admin'");
    return res.rows;
  }
  static async getAllStaffs() {
    const res = await pool.query("SELECT * FROM users WHERE role = 'staff'");
    return res.rows;
  }
  static async getAllCertificates() {
    const res = await pool.query("SELECT * FROM certificates");
    return res.rows;
  }
    static async checkDbHealth() {
        const start = Date.now();
        await pool.query('SELECT 1');
        return Date.now() - start;
    }
  static async getAllDocuments() {
    const res = await pool.query(
        `SELECT
            d.id,
            d.file_name,
            d.file_url,
            d.uploaded_at,
            d.stage_name,
            u.fullname AS student_name,
            d.matric_number,
            uni.name AS university_name,
            d.university_id,
            cr.is_approved
         FROM documents d
         LEFT JOIN users u ON u.matric_number = d.matric_number
         LEFT JOIN universities uni ON uni.university_id = d.university_id
         LEFT JOIN clearance_records cr ON cr.id = d.clearance_record_id
         ORDER BY d.uploaded_at DESC`
    );
    return res.rows;
  }

}

export default SuperAdmin;