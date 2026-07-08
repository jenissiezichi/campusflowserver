import {verifyCertificate} from "../services/solanaService.js";
import Certificate from "../models/Certificate.js";
import VerificationRecord from "../models/Verification.js";
import crypto from "crypto";

export const verifyCertificateController = async (req, res) => {
    try {
        const { document_hash, verifier_org } = req.body;

        if (!document_hash || !verifier_org || !document_hash.trim()) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const certRecord = await Certificate.findByHash(document_hash);

        if (!certRecord) {
            return res.json({
                success: true,
                verified: false,
                message: 'No certificate found for this hash.',
            });
        }

        if (!certRecord.is_valid) {
            return res.json({
                success: true,
                verified: false,
                revoked: true,
                message: 'This certificate has been revoked by the issuing institution.',
                certificate: certRecord,
            });
        }

        const { matric_number, university_id } = certRecord;

        // Check if this certificate has already been verified on-chain before.
        const existingVerifications = await VerificationRecord.findByHash(document_hash);
        const existingOnChainRecord = existingVerifications.find((v) => v.pda_address);

        let chainResult;

        if (existingOnChainRecord) {
            // Already proven on-chain once — reuse that proof, don't touch the chain again.
            chainResult = {
                tx: existingOnChainRecord.tx_signature,
                verificationPDA: existingOnChainRecord.pda_address,
            };
        } else {
            // First time this hash is being verified — write the permanent on-chain proof.
            chainResult = await verifyCertificate({
                documentHash: document_hash,
                verifierOrg: verifier_org || 'Public Verification Portal',
                studentId: matric_number,
                universityId: university_id,
            });
        }

        // Always log this specific check in Postgres, regardless of whether chain was touched.
        const dbRecord = await VerificationRecord.create({
            documentHash: document_hash,
            verifierOrg: verifier_org,
            verifierId: crypto.randomUUID(),
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
            chain: chainResult,
            onChainProofReused: Boolean(existingOnChainRecord),
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};