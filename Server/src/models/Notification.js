import pool from '../configs/db.js';

class Notification {
    static async create({ matricNumber, universityId, title, message }) {
        const res = await pool.query(
            `INSERT INTO notifications (matric_number, university_id, title, message)
             VALUES ($1, $2, $3, $4)
                 RETURNING *`,
            [matricNumber, universityId, title, message]
        );
        return res.rows[0];
    }

    static async findByStudent(matricNumber, universityId) {
        const res = await pool.query(
            `SELECT * FROM notifications WHERE matric_number = $1 AND university_id = $2 ORDER BY created_at DESC LIMIT 20`,
            [matricNumber, universityId]
        );
        return res.rows;
    }

    static async markAsRead(id, matricNumber, universityId) {
        const res = await pool.query(
            `UPDATE notifications SET is_read = true WHERE id = $1 AND matric_number = $2 AND university_id = $3 RETURNING *`,
            [id, matricNumber, universityId]
        );
        return res.rows[0];
    }

    static async markAllAsRead(matricNumber, universityId) {
        await pool.query(
            `UPDATE notifications SET is_read = true WHERE matric_number = $1 AND university_id = $2 AND is_read = false`,
            [matricNumber, universityId]
        );
    }
}

export default Notification;