import Admin from '../models/admin.model.js';
import Certificate from '../models/Certificate.js';
import Clearance from "../models/Clearance.js";

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
