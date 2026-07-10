import {keypair, program, wallet} from "../configs/solana.js"
import {PublicKey, SystemProgram} from "@solana/web3.js";

export const registerUniversity = async (universityId, name) => {
    const [universityPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("university"), Buffer.from(universityId)], // anchor seeds for university
        program.programId
    );
    const tx = await program.methods.registerUniversity(universityId, name)// pb function parameters in rust
        .accounts({
            university: universityPDA,
            authority: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        }).signers([keypair])
        .rpc()

    return {
        tx,
        universityPDA: universityPDA.toString(),
    };
};

export const getUniversityId = async (universityId) => {
    const [universityPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("university"), Buffer.from(universityId)],// anchor seeds
        program.programId
    );

    const data = await program.account.university.fetch(universityPDA);

    return {
        universityPDA: universityPDA.toString(),
        universityId: data.universityId,
        name: data.name,
        admin: data.admin.toString(),
        timestamp: data.timestamp.toString(),
        isActive: data.isActive,
    };
};

export const getAllUniversities = async () => {
    const universities = await program.account.university.all();
    return universities.map((item) => ({
        universityPDA: item.publicKey.toString(),
        universityId: item.account.universityId,
        name: item.account.name,
        admin: item.account.admin.toString(),
        timestamp: item.account.timestamp.toString(),
        isActive: item.account.isActive,
    }));
};

export const givemeCertificate = async () => {
    const certificates = await program.account.certificate.all();
    return certificates.map((item) => ({
        pdaAddress: item.publicKey.toString(),
        hash: item.account.hash,
        studentId: item.account.studentId,
        studentName: item.account.studentName,
        certificateType: item.account.certificateType,
        institution: item.account.institution,
        timestamp: item.account.timestamp.toString(),
        isValid: item.account.isValid,
    }));
};

export const fetchAllIncidents = async (universityId) => {
    const incidents = await program.account.incident.all();
    return incidents
        .filter(item => item.account.universityId === universityId)
        .map((item) => ({
            incidentPDA: item.publicKey.toString(),
            universityId: item.account.universityId,
            studentId: item.account.studentId,
            studentName: item.account.studentName,
            latitude: item.account.latitude,
            longitude: item.account.longitude,
            description: item.account.description,
            timestamp: item.account.timestamp.toString(),
        }));
}

export const reportIncident = async ({
    universityId, studentId, incidentId, studentName, latitude, longitude, description
}) => {
    const [universityPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("university"), Buffer.from(universityId)],
        program.programId
    );
    const [incidentPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("incident"), universityPDA.toBuffer(), Buffer.from(studentId), Buffer.from(incidentId)],
        program.programId
    );
    const tx = await program.methods
        .reportIncident(incidentId, studentId, studentName, latitude.toString(), longitude.toString(), description)// pb function parameters in rust
        .accounts({
            incident: incidentPDA,
            university: universityPDA,
            authority: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();
    return { tx, incidentPDA: incidentPDA.toString() };
};

export const issueCertificate = async ({ universityId, studentId, studentName, certificateType, institution, hash }) => {
    
    if (!studentId) {
        throw new Error("Solana Error: studentId is missing or undefined.");
    }
    if (!universityId) {
        throw new Error("Solana Error: universityId is missing or undefined.");
    }

    const hashBuffer = Buffer.from(hash);

    if (studentId.length > 32) {
        throw new Error(`Solana Error: studentId is too long (${studentId.length} chars). Max is 32.`);
    }
    if (universityId.length > 32) {
        throw new Error(`Solana Error: universityId is too long (${universityId.length} chars). Max is 32.`);
    }

    const [certificatePDA] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("certificate"), 
            Buffer.from(studentId), 
            hashBuffer
        ], 
        program.programId
    );

    const [universityPDA] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("university"), 
            Buffer.from(universityId)
        ],
        program.programId
    );

    const tx = await program.methods
        .issueCertificate(hash, studentId, studentName, certificateType) 
        .accounts({
            certificate: certificatePDA,
            university: universityPDA,
            authority: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

    return { tx, certificatePDA: certificatePDA.toString() };
};


export const getOnChainCertificate = async (studentId, hash) => {
    const [certificatePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("certificate"), Buffer.from(studentId), Buffer.from(hash)],
        program.programId
    );
    try {
        const data = await program.account.certificate.fetch(certificatePDA);
        return {
            ...data,
            timestamp: data.timestamp.toString(),
        };
    } catch {
        return null;
    }
};

export const revokeCertificate = async ({ hash, studentId, universityId }) => {
    const [certificatePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("certificate"), Buffer.from(hash), Buffer.from(studentId)],
        program.programId
    );
    const [universityPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("university"), Buffer.from(universityId)],
        program.programId
    );

    const tx = await program.methods.revokeCertificate(hash, studentId)
        .accounts({
            certificate: certificatePDA,
            university: universityPDA,
            authority: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();
    return { tx, certificatePDA: certificatePDA.toString() };
}

export const fetchAllVerification = async (universityId) => {
    const records = await program.account.verificationRecord.all();
    return records.filter(item => item.account.universityId === universityId)
        .map((item) => ({
            verificationPDA: item.publicKey.toString(),
            documentHash: item.account.documentHash,
            verifierOrg: item.account.verifierOrg,
            verifier: item.account.verifier.toString(),
            timestamp: item.account.timestamp.toString(),

        }))
}

export const approveClearance = async ({ universityId, studentId, stageName, documentHash, staffId }) => {
    const [universityPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("university"), Buffer.from(universityId)],
        program.programId
    );
    const [clearancePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("clearance"), universityPDA.toBuffer(), Buffer.from(studentId), Buffer.from(stageName)],
        program.programId
    );
    const tx = await program.methods
        .approveClearance(studentId, stageName, documentHash, staffId)
        .accounts({
            clearanceRecord: clearancePDA,
            university: universityPDA,
            authority: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();
    return { tx, clearancePDA: clearancePDA.toString() };
};

