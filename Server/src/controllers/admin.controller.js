import CloudinaryModel from '../models/cloudinaryModel.js';
import Certificate from '../models/Certificate.js';

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