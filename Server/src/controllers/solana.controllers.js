import { getAllUniversities, getOnChainCertificate, registerUniversity } from "../services/solanaService.js";

import crypto from 'crypto';
import { wallet } from '../configs/solana.js';
import Certificate from '../models/Certificate.js';
import Incident from '../models/Incident.js';
import University from "../models/University.js";
import VerificationRecord from "../models/Verification.js";
import { sendEmail } from "../services/email.service.js";
import { fetchAllVerification, givemeCertificate, issueCertificate, reportIncident, revokeCertificate } from '../services/solanaService.js';

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
            chain: universities,
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
        const securityEmail = process.env.SECURITY_ALERT_EMAIL;

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
        // const incident = await fetchAllIncidents(universityId);
        res.status(200).json({
            success: true,
            count: incidents.length,
            // chain: incident,
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
        const { studentName, matricNumber, certificateType, institution } = req.body;

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
            txSignature: chainResult.tx,
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
        const universityId = req.user.university;
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
        const matric_number = req.user.matricNumber;   // ✅
        const universityId = req.user.universityId;     // ✅
        const cert = await Certificate.getCertificateByMatric(matric_number, universityId);

        let onChain = null;
        if (cert) {
            onChain = await getOnChainCertificate(matric_number, cert.hash);
        }

        res.status(200).json({ success: true, data: cert, chain: onChain });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const revokeCertificateController = async (req, res) => {
    try {
        const { hash } = req.body;
        const universityId = req.user.university;
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
        const universityId = req.user.university;
        const chain = await fetchAllVerification();
        const records = await VerificationRecord.findByUniversity(universityId);
        res.status(200).json({ success: true, count: records.length, db: records, chaindb: chain });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

