import SuperAdmin from "../models/superadmin.models.js";

export const getAllStudents = async (req, res) => {
  try {
    const users = await SuperAdmin.getAllUsers();
    return res.status(200).json({
      message: "Users gotten successfully",
      users,
    });
  } catch (err) {
    return res.status(500).json({
      message: err?.message || "Internal server error while fetching users",
    });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await SuperAdmin.getAllAdmins();
    return res.status(200).json({
      message: "Admins gotten successfully",
      admins
    });
  } catch (err) {
    return res.status(500).json({
      message: err?.message || "Internal server error while fetching admins",
    });
  }
};

export const getAllStaffs = async (req, res) => {
  try {
    const staffs = await SuperAdmin.getAllStaffs();
    return res.status(200).json({
      message: "Staffs gotten successfully",
      staffs
    });
  } catch (err) {
    return res.status(500).json({
      message: err?.message || "Internal server error while fetching staff records",
    });
  }
};

export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await SuperAdmin.getAllCertificates();
    return res.status(200).json({
      message: "All certificates returned successfully",
      certificates,
    });
  } catch (err) {
    return res.status(500).json({
      message: err?.message || "Internal server error while fetching certificates",
    });
  }
};
