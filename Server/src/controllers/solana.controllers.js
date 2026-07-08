import { registerUniversity, getAllUniversities } from "../services/solanaService.js"

import University from "../models/University.js";
import { fetchAllIncidents } from "../services/solanaService.js"
import { wallet } from '../configs/solana.js'
import { reportIncident } from '../services/solanaService.js'
import Incident from '../models/Incident.js'
import crypto from 'crypto'
import { revokeCertificate } from '../services/solanaService.js'
import Certificate from '../models/Certificate.js'
import { issueCertificate } from '../services/solanaService.js'
import VerificationRecord from "../models/Verification.js"
import { verifyCertificate } from '../services/solanaService.js'
import { givemeCertificate } from '../services/solanaService.js'
import { fetchAllVerification } from '../services/solanaService.js'
import {sendEmail} from "../services/email.service.js";


export const createUniversity = async (req, res) => {
    try {
        const { universityId, name } = req.body;

        if (!name || !universityId) {
            return res.status(400).json({
                success: false,
                message: "University ID and name are required."
            });
        }
        const data = await registerUniversity(universityId, name);
        const dbRecord = await University.create({
            universityId,
            name,
            admin: wallet.publicKey.toString(),
            timestamp: Math.floor(Date.now() / 1000),
            txSignature: data.tx,
            pdaAddress: data.universityPDA,
        });

        res.status(201).json({
            success: true,
            message: `University registered successfully.`,
            data,
            db: dbRecord,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
};

export const fetchAllUniversity = async (req, res) => {
    try {
        const universities = await getAllUniversities();
        const allUni = await University.findAll();
        res.status(200).json({
            success: true,
            count: universities.length,
            data: universities,
            db: allUni,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};



export const createIncidentReport = async (req, res) => {
    try {
        console.log("req.user:", req.user);
        const { category, locationText, description, latitude, longitude } = req.body;
        const matric_number = req.user.matricNumber;
        const studentName = req.user.fullname;
        const universityId = req.user.universityId;
        const incidentId = crypto.randomUUID().replace(/-/g, '');
        const timestamp = Math.floor(Date.now() / 1000);

        const chainResult = await reportIncident({
            universityId,
            studentId: matric_number.toString(),
            incidentId,
            studentName,
            latitude,
            longitude,
            description,
        });
const securityEmail =  process.env.SECURITY_ALERT_EMAIL;

        await sendEmail(securityEmail, "sosAlert", {
            student_name: studentName,
            matricNumber: matric_number,
            location: locationText,
            description,
        });

        const dbRecord = await Incident.create({
            incidentId,
            matric_number,
            studentName,
            category,
            locationText,
            latitude,
            longitude,
            description,
            universityId,
            timestamp,
            txSignature: chainResult.tx,
            pdaAddress: chainResult.incidentPDA,
        })
        res.status(200).json({ success: true, message: `Incident reported Successfully.`, data: dbRecord });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message, });
    }
};

export const getAllIncidents = async (req, res) => {
    try {
        const universityId = req.user.universityId;
        const incidents = await Incident.findAllIncidents(universityId);
        const incident = await fetchAllIncidents(universityId);
        res.status(200).json({
            success: true,
            count: incidents.length,
            chain: incident,
            database: incidents,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

// export const getIncID = async (req, res) => {
//     try{
//         const database = await Incident.findByIncidentId(incidentId)
//     }
// }






export const createCertificate = async (req, res) => {
    try {
        const { studentName, matricNumber, certificateType, institution } = req.body; // ✅ from frontend

        const universityId = req.user.universityId;
        const certificateUrl = req.file.path;
        const timestamp = Math.floor(Date.now() / 1000);
        const hash = crypto
            .createHash('md5')
            .update(`${matricNumber}-${studentName}-${certificateType}-${institution}-${timestamp}`)
            .digest('hex');

        const chainResult = await issueCertificate({
            universityId,
            studentId: matricNumber,
            studentName,
            certificateType,
            institution,
            hash,
        });

        const dbRecord = await Certificate.create({
            hash,
            studentName,
            certificateType,
            matricNumber,
            institution,
            universityId,
            certificateUrl,
            timestamp,
            txSignature:chainResult.tx,
            pdaAddress: chainResult.certificatePDA,
        });

        res.status(201).json({
            success: true,
            message: "Certificate Processed Successfully.",
            database: dbRecord,
            chain: chainResult
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const getAllCertificate = async (req, res) => {
    try {
        const universityId = req.user.universityId;
        const dbCert = await Certificate.findAllCertificates(universityId);
        const chainCert = await givemeCertificate(universityId);

        res.status(200).json({
            success: true,
            count: dbCert.length,
            db: dbCert,
            chain: chainCert,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message, });
    }
}

export const getCertificateById = async (req, res) => {
    try {
        const { matricNumber, id } = req.params;
        const dbCert = await Certificate.getCertificateByMatric(matricNumber);
        const chainCert = null;

        res.status(200).json({
            success: true,
            db: dbCert,
            chain: dbCert,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message, });
    }
}



export const revokeCertificateController = async (req, res) => {
    try {
        const { hash } = req.body;
        const universityId = req.user.universityId;
        const certRecord = await Certificate.findByHash(hash);
        if (!certRecord) {
            return res.status(404).json({ success: false, message: "Certificate not found" });
        }
        if (certRecord.university_id !== universityId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }
        const chainResult = await revokeCertificate({
            hash,
            studentId: certRecord.matric_number,
            universityId,
        });
        const dbRecord = await Certificate.revoke(hash);
        res.status(200).json({
            success: true,
            message: 'Certificate was revoked successfully',
            data: dbRecord,
            chain: chainResult
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const getVerificationRecords = async (req, res) => {
    try {
        const universityId = req.user.universityId;
        const chain = await fetchAllVerification();
        const records = await VerificationRecord.findByUniversity(universityId);
        res.status(200).json({ success: true, count: records.length, db: records, chaindb: chain });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const getVerificationByHash = async (req, res) => {
    try {
        const { hash } = req.params;
        const universityId = req.user.universityId;

        const records = await VerificationRecord.findByHash(hash);
        if (!records.length) {
            return res.status(404).json({ success: false, message: "No verification found" });
        }
        if (records[0].university_id !== universityId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }
        res.status(200).json({ success: true, count: records.length, db: records });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

