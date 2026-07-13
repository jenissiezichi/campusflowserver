import Certificate from "../models/Certificate.js";
import VerificationRecord from "../models/Verification.js";
import {getOnChainCertificate} from "../services/solanaService.js";

export const verifyCertificateController = async (req, res) => {
    function maskMatric(m) {
        if (!m || m.length < 6) return m;
        return `${m.slice(0, 4)}${"*".repeat(m.length - 7)}${m.slice(-3)}`;
    }

    try {
        const { document_hash, verifier_org } = req.body;

        if (!document_hash || !verifier_org) {
            return res.status(400).json({ success: false, message: "document_hash and verifier_org are required." });
        }

        const certRecord = await Certificate.findByHash(document_hash);
        if (!certRecord) {
            return res.status(404).json({ success: false, message: "Certificate not found." });
        }

        const { matric_number, university_id } = certRecord;

        // read-only check against the chain — no transaction, no fees
        const onChainCert = await getOnChainCertificate(matric_number, document_hash);

        if (!onChainCert) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found on-chain. It may not have been issued correctly.",
            });
        }

        if (!onChainCert.isValid) {
            return res.status(200).json({
                success: true,
                verified: false,
                message: "Certificate exists on-chain but has been revoked.",
                certificate: certRecord,
                chain: onChainCert,
            });
        }


        let verificationRecord = null;
        try {
            verificationRecord = await VerificationRecord.create({
                documentHash: document_hash,
                verifierOrg: verifier_org,
                universityId: university_id,
            });
        } catch (dbErr) {
            console.error("Failed to log verification record:", dbErr.message);

        }

        res.status(200).json({
            success: true,
            verified: onChainCert.isValid,
            message: onChainCert.isValid
                ? "Certificate verified successfully."
                : "Certificate exists on-chain but has been revoked.",
            certificate: {
                studentName: onChainCert.studentName,
                matricNumberMasked: maskMatric(certRecord.matric_number), // e.g. "2024****217"
                certificateType: onChainCert.certificateType,
                institution: onChainCert.institution,       // canonical, from chain
                issuedOn: onChainCert.timestamp,
                certificateUrl: certRecord.certificate_url,  // keep only if you want the image visible publicly
            },
            proof: {
                hash: document_hash,
                pdaAddress: certRecord.pda_address,           // needed for the explorer link
                explorerUrl: `https://explorer.solana.com/address/${certRecord.pda_address}?cluster=devnet`,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};