import Document from "../models/document.model.js";
import Clearance from "../models/Clearance.js";

export const uploadStudentDocument = async (req, res) => {
  try {
    const matricNumber = req.user.matricNumber;
    const universityId = req.user.universityId;
    const { stageName } = req.body;


    console.log("DEBUG:", { matricNumber: matricNumber, universityId, stageName, file: req.file?.originalname });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    if (!stageName) {
      return res.status(400).json({ message: "Stage name is required." });
    }

    const fileUrl = req.file.path;
    const fileName = req.file.originalname;

    const doc = await Document.createDocument(
        matricNumber,
        universityId,
        stageName,
        fileName,
        fileUrl
    );

    const clearanceRecord = await Clearance.addToClearance({
      matricNumber,
      studentName: req.user.fullname,
      stageName,
      universityId,
    });

    await Document.linkToClearanceRecord(doc.id, clearanceRecord.id);

    res.status(201).json({
      message: "File uploaded successfully",
      data: doc,
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Failed to upload document",
    });
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
