import pool from '../configs/db.js'

    class VerificationRecord {
    static async create({  documentHash, verifierOrg, verifierId, universityId, timestamp, txSignature, pdaAddress }) {
        const res = await pool.query(
            `INSERT INTO verification_records ( document_hash, verifier_org, verifier_id, university_id, timestamp, tx_signature, pda_address)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
            [ documentHash, verifierOrg, verifierId, universityId, timestamp, txSignature, pdaAddress]
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

