import pool from '../configs/db.js';

class User {
  static async create(fullname, email, role = null, university = null, passwordHash = null, department = null, level = null, matric_number) {
    const res = await pool.query(
        'INSERT INTO users (fullname, email, role, university, password_hash, department, level, matric_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, fullname, email, role, university, matric_number, department, level',
        [fullname, email, role, university, passwordHash, department, level, matric_number]
    );
    return res.rows[0];
  }

  static async findByEmail(email) {
    const res = await pool.query( 
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return res.rows[0];
  }

  static async findById(id) {
    const res = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return res.rows[0];
  }
   // Update the OTP and expiry for a user by email
  static async updateResetOTP(email, otp, expiresAt) {
    const res = await pool.query(
      'UPDATE users SET reset_otp = $1, reset_otp_expires = $2 WHERE email = $3 RETURNING id',
      [otp, expiresAt, email.toLowerCase()]
    );
    return res.rows[0];
  }

  // Fetch the OTP data explicitly for verification
  static async findResetDataByEmail(email) {
    const res = await pool.query(
      'SELECT id, reset_otp, reset_otp_expires FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return res.rows[0];
  }

  // Update the password hash and clear the temporary OTP fields completely
  static async updatePasswordAndClearOTP(id, passwordHash) {
    const res = await pool.query(
      'UPDATE users SET password_hash = $1, reset_otp = NULL, reset_otp_expires = NULL WHERE id = $2 RETURNING id',
      [passwordHash, id]
    );
    return res.rows[0];
  }

  static async updateProfile(id, role, university) {
  const res = await pool.query(
    'UPDATE users SET role = $1, university = $2 WHERE id = $3 RETURNING id, fullname, email, role, university',
    [role, university, id]
  );
  return res.rows[0];
}
}

export default User;
