import Document from "../models/document.model.js";

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