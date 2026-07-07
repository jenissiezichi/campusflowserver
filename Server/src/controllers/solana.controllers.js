import { getAllUniversities, registerUniversity } from "../services/solanaService.js";

import crypto from 'crypto';
import { wallet } from '../configs/solana.js';
import Certificate from '../models/Certificate.js';
import Incident from '../models/Incident.js';
import University from "../models/University.js";
import VerificationRecord from "../models/Verification.js";
import { fetchAllIncidents, fetchAllVerification, givemeCertificate, issueCertificate, revokeCertificate, verifyCertificate } from "../services/solanaService.js";


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
        const { category, locationText, description, latitude, longitude } = req.body;
        const matric_number = req.user.matricNumber;
        const studentName = req.user.fullname;
        const universityId = req.user.university;
        const incidentId = crypto.randomUUID();
        const timestamp = Math.floor(Date.now() / 1000);

        // const chainResult = await reportIncident({
        //     universityId,
        //     studentId: studentId.toString(),
        //     incidentId,
        //     studentName,
        //     latitude,
        //     longitude,
        //     description,
        // });

        //  commented the chain writing out for now

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
            txSignature: null, //chainResult.tx,
            pdaAddress: null,  //chainResult.incidentPDA,
        })
        res.status(200).json({ success: true, message: `Incident reported Successfully.`, data: dbRecord });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message, });
    }
};

export const getAllIncidents = async (req, res) => {
    try {
        const universityId = req.user.university;
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

export const verifyCertificateController = async (req, res) => {
    try {
        const { document_hash, verifier_org } = req.body;
        const verifierId = req.user.id;
        const timestamp = Math.floor(Date.now() / 1000);

        const certRecord = await Certificate.findByHash(document_hash);
        if (!certRecord) {
            return res.status(404).json({ success: false, message: "Certificate not found." });
        }

        const { matric_number, university_id } = certRecord;

        const chainResult = await verifyCertificate({
            documentHash: document_hash,
            verifierOrg: verifier_org,
            studentId: matric_number,
            universityId: university_id,
        });

        const dbRecord = await VerificationRecord.create({
            documentHash: document_hash,
            verifierOrg: verifier_org,
            verifierId,
            universityId: university_id,
            timestamp,
            txSignature: chainResult.tx,
            pdaAddress: chainResult.verificationPDA,
        });

        res.status(201).json({
            success: true,
            message: "Certificate verified successfully.",
            certificate: certRecord,
            verification: dbRecord,
            chain: chainResult
        });
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

export const getVerificationByHash = async (req, res) => {
    try {
        const { hash } = req.params;
        const universityId = req.user.university;

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

