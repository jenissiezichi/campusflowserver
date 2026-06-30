import pool from "../configs/db.js";

class CloudinaryModel {
  static async addCertificate(certificateUrl) {
    await pool.query("INSERT INTO TABLE certificates WHERE certificate_url = $1", [certificateUrl])
  }
}

export default CloudinaryModel;