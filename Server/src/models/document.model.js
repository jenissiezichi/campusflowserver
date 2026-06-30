import pool from "../configs/db.js";

class Document {
  static async createDocument(studentId, universityId, stageName, fileName, fileUrl, isApproved) {
    await pool.query('INSERT INTO documents(student_id, university_id, stage_name, file_name, file_url, is_approved) VALUES($1, $2, $3, $4, $5, $6)', [studentId, universityId, stageName, fileName, fileUrl, isApproved]);
  }
}

export default Document;