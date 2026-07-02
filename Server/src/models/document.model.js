import pool from "../configs/db.js";

class Document {
  static async createDocument(matricNumber, universityId, stageName, fileName, fileUrl) {
    const res = await pool.query(
        `INSERT INTO documents(matric_number, university_id, stage_name, file_name, file_url)
             VALUES($1, $2, $3, $4, $5)
             RETURNING *`,
        [matricNumber, universityId, stageName, fileName, fileUrl]
    );
    return res.rows[0];
  }

  static async linkToClearanceRecord(documentId, clearanceRecordId) {
    const res = await pool.query(
        `UPDATE documents SET clearance_record_id = $1 WHERE id = $2 RETURNING *`,
        [clearanceRecordId, documentId]
    );
    return res.rows[0];
  }
}



export default Document;