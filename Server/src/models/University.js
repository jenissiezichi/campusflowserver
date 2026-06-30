import pool from '../configs/db.js'

class University {
    static async create({ universityId, name, admin, timestamp, txSignature, pdaAddress }) {
        const res = await pool.query(
            `INSERT INTO universities (university_id, name, admin, timestamp, tx_signature, pda_address)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [universityId, name, admin, timestamp, txSignature, pdaAddress]
        );
        return res.rows[0];
    }

    static async findByUniversityId(universityId) {
        const res = await pool.query(
            'SELECT * FROM universities WHERE university_id = $1',
            [universityId]
        );
        return res.rows[0];
    }

    static async findAll() {
        const res = await pool.query('SELECT * FROM universities ORDER BY id DESC');
        return res.rows;
    }



}

export default University;
