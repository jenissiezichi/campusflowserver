import Admin from '../models/admin.model.js';
import Certificate from '../models/Certificate.js';
import Clearance from "../models/Clearance.js";
import { approveClearance } from '../services/solanaService.js';

export const createCertificate = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });
    const certificateUrl = req.file.path;

    await Certificate.create(hash, studentId, studentName, certificateType, institution, universityId, timestamp, txSignature, pdaAddress);

    return res.status(200).json({
      message: "Certificate uploaded successfully!",
      url: certificateUrl
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}
export const getAllStudents = async (req, res) => {
  try {
    const students = await Admin.getAllStudent(req.user.universityId);
    return res.status(200).json({
      message: "All students retrieved successfully",
      students
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

export const getStudentsByLevel = async (req, res) => {
  try {
    const { level } = req.query;
    const universityId = req.user.universityId;
    if (!level) return res.status(400).json({ message: "Level is required." });
    const students = await Admin.getStudentsByLevel(universityId, level);
    return res.status(200).json({ students });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getCertificateByMatric = async (req, res) => {
  try {
    const { matric_number } = req.params;
    const certs = await Admin.findByMatricNumber(matric_number);
    res.status(200).json({ success: true, certificates: certs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllClearanceUpload = async (req, res) => {
  try {
    const clearance = await Clearance.getAll(req.user.universityId);
    res.status(200).json({ success: true, data: clearance });
  }
  catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export const approveClearanceController = async (req, res) => {
  try {
    if (!['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Only staff or admin can approve clearance." });
    }

    const { id } = req.params;
    const record = await Clearance.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Clearance record not found." });
    }
    if (record.is_approved === true) {
      return res.status(400).json({ success: false, message: "This clearance has already been approved." });
    }

    const staffId = req.user.id.toString();

    const chainResult = await approveClearance({
      universityId: record.university_id,
      studentId: record.matric_number,
      stageName: record.stage_name,
      documentHash: record.document_hash,
      staffId,
    });

    const updated = await Clearance.approve({
      id,
      staffId,
      staffUserId: req.user.id,
      documentHash: record.document_hash,
      txSignature: chainResult.tx,
      pdaAddress: chainResult.clearancePDA,
    });

    res.status(200).json({
      success: true,
      message: "Clearance approved successfully.",
      data: updated,
      chain: chainResult,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const rejectClearanceController = async (req, res) => {
  try {
    if (!['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Only staff or admin can reject clearance." });
    }

    const { id } = req.params;
    const record = await Clearance.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Clearance record not found." });
    }

    const updated = await Clearance.reject({
      id,
      staffId: req.user.id.toString(),
      staffUserId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Clearance rejected.",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};