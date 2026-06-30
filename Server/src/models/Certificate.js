import pool from '../configs/db.js'

class Certificate{
    static async create ({ hash, studentId, studentName, certificateType, institution, universityId, timestamp, txSignature, pdaAddress }) {
        const res = await pool.query(
            `INSERT INTO certificates ( hash, student_id, student_name, certificate_type, institution, university_id, timestamp, is_valid, tx_signature, pda_address)
VALUES($1, $2, $3, $4, $5, $6, $7, true,$8, $9)
RETURNING *`,
            [ hash, studentId, studentName, certificateType, institution, universityId, timestamp, txSignature, pdaAddress]
        );
        return res.rows[0];
    }
    static async findByHash(hash){
        const res = await pool.query(`SELECT * FROM certificates WHERE hash = $1`,[hash]);
        return res.rows[0];
    }

    static async findAllCertificates(universityId){
        const res = await pool.query(
            `SELECT * FROM certificates WHERE university_id = $1 ORDER BY created_at DESC`,[universityId],
        );
        return res.rows;
    }
    static async findByCertificateId(id) {
        const res = await pool.query(
            `SELECT * FROM certificates WHERE id = $1`,[id],
        );
        return res.rows[0];
    }
static async revoke(hash){
        const res = await pool.query(
            `UPDATE certificates SET is_valid = false WHERE hash =$1 RETURNING *`,[hash],
        );
        return res.rows[0];
}

}
export default Certificate;