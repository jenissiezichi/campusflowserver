import pool from '../configs/db.js'
 class Incident {


     static async create({incidentId, matric_number, studentName, category, locationText, latitude,
                             longitude, description, universityId, timestamp, txSignature, pdaAddress
                                 }) {
         const res = await pool.query(
             `INSERT INTO incidents
             (incident_id, matric_number, student_name, category, location_text, latitude, longitude, description, university_id, timestamp, tx_signature, pda_address)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             RETURNING *`,
             [incidentId, matric_number, studentName, category, locationText, latitude, longitude, description, universityId, timestamp, txSignature, pdaAddress]
         );
         return res.rows[0];
     }

     static async findByIncidentId(incidentId) {
         const res = await pool.query(
             'SELECT * FROM incidents WHERE incident_id = $1',
             [incidentId]
         );
         return res.rows[0];
     }

     static async findAllIncidents(universityId) {
         const res = await pool.query('SELECT * FROM incidents WHERE university_id = $1 ORDER BY created_at DESC',[universityId]);
         return res.rows;
     }


 }
 export default Incident;