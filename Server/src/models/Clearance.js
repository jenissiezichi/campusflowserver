import pool from '../configs/db.js';

class Clearance{
  static async getAllStages(universityId) {
    const res = await pool.query
    ('SELECT * FROM clearance_stages WHERE university_id = $1 ORDER BY id ASC', [universityId]);
    return res.rows;
  }

  static async addToClearance({ matricNumber, studentName, stageName, universityId, documentHash }) {
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await pool.query(
        `INSERT INTO clearance_records (matric_number, student_name, stage_name, university_id, timestamp, is_approved, document_hash)
         VALUES ($1, $2, $3, $4, $5, null, $6)
           ON CONFLICT (matric_number, stage_name)
         DO UPDATE SET
          student_name = EXCLUDED.student_name,
                         timestamp = EXCLUDED.timestamp,
                         is_approved = null,
                         document_hash = EXCLUDED.document_hash,
                         staff_id = null,
                         staff_user_id = null,
                         tx_signature = null,
                         pda_address = null
                         RETURNING *`,
        [matricNumber, studentName, stageName, universityId, timestamp, documentHash]
    );
    return res.rows[0];
  }

  static async approve({ id, staffId, staffUserId, documentHash, txSignature, pdaAddress }) {
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await pool.query(
        `UPDATE clearance_records
         SET is_approved = true,
             staff_id = $1,
             staff_user_id = $2,
             document_hash = $3,
             tx_signature = $4,
             pda_address = $5,
             timestamp = $6
         WHERE id = $7
         RETURNING *`,
        [staffId, staffUserId, documentHash, txSignature, pdaAddress, timestamp, id]
    );
    return res.rows[0];
  }

  static async reject({ id, staffId, staffUserId }) {
    const res = await pool.query(
        `UPDATE clearance_records
         SET is_approved = false,
             staff_id = $1,
             staff_user_id = $2
         WHERE id = $3
         RETURNING *`,
        [staffId, staffUserId, id]
    );
    return res.rows[0];
  }

  static async findById(id) {
    const res = await pool.query('SELECT * FROM clearance_records WHERE id = $1', [id]);
    return res.rows[0];
  }

    static async getAll(universityId) {
        const res = await pool.query(
            `SELECT cr.*,
            COALESCE(
                json_agg(
                    json_build_object('file_name', d.file_name, 'file_url', d.file_url)
                ) FILTER (WHERE d.id IS NOT NULL), '[]'
            ) AS documents
         FROM clearance_records cr
         LEFT JOIN documents d ON d.clearance_record_id = cr.id
         WHERE cr.university_id = $1
         GROUP BY cr.id
         ORDER BY cr.created_at DESC`,
            [universityId]
        );
        return res.rows;
    }

  static async getStudentRecords(matricNumber) {
    const res = await pool.query(
        'SELECT stage_name, is_approved, created_at FROM clearance_records WHERE matric_number = $1',
        [matricNumber]
    );
    return res.rows;
  }

}export default Clearance;