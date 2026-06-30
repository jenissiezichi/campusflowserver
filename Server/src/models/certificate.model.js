import pool from '../configs/db.js';

class Certificate {
  static async create(hash, studentId, studentName, certificateType, institution, universityId, timestamp, isValid, txSignature, pdaAddress, createdAt, certificateUrl) {
    const res = await pool.query('INSERT INTO certificates (hash, student_id, student_name, certificate_type, institution, university_id, timestamp, is_valid, tx_signature, pda_address, created_at, certificate_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 12) RETURNING student_name, certificate_type, institution, created_at', [hash, studentId, studentName, certificateType, institution, universityId, timestamp, isValid, txSignature, pdaAddress, createdAt, certificateUrl])
    return res.rows[0];
  }

  static async revoke(studentId) {
    await pool.query(`UPDATE certificates SET is_valid = false WHERE student_id = $1`, [studentId])
  }
}

export default Certificate;