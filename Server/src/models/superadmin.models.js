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
  static async 
}

export default SuperAdmin;
