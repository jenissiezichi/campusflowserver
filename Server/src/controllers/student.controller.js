import Document from "../models/document.model.js";
import Clearance from "../models/Clearance.js";

export const uploadStudentDocument = async (req, res, next) => {
  try {
    const { studentId, universityId, stageName, isApproved } = req.body;
    const fileUrl = req.file.path;
    const fileName = req.file.originalname;

    await Document.createDocument(studentId, universityId, stageName, fileName, fileUrl, isApproved);

    res.status(201).json({
      message: "File uploaded successfully",
      ...req.file
    })
  } catch (error) {
    res.status(400).json({
      message: error?.message || "Failed to update database",
    })
  }

};

export const getClearanceStages = async (req, res, next) => {
  try {
    const { universityId } = req.user;
    const stages = await Clearance.getAllStages(universityId);
    res.json({ 
      success: true,
      message: "Clearance stages fetched successfully",
      data:
      stages });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.message || "Failed to fetch clearance stages",
    })
  }
};