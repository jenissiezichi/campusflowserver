import pool from '../configs/db.js'

    class VerificationRecord {
        static async create({ documentHash, verifierOrg, universityId }) {
            const res = await pool.query(
                `INSERT INTO verification_records (document_hash, verifier_org, university_id)
                 VALUES($1, $2, $3)
                     RETURNING *`,
                [documentHash, verifierOrg, universityId]
            );
            return res.rows[0];
        }

    static async findByHash(documentHash) {
        const res = await pool.query(
            `SELECT * FROM verification_records WHERE document_hash = $1 ORDER BY created_at DESC`,
            [documentHash]
    );
        return res.rows;
    }
    static async findByUniversity(universityId) {
        const res = await pool.query(
            `SELECT FROM verification_records WHERE university_id = $1 ORDER BY created_at DESC`,[universityId],
        );
        return res.rows;
    }
}

export default VerificationRecord;

