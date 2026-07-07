import SuperAdmin from "../models/superadmin.models.js";

export const getAllStudents = async (req, res) => {
  const users = await SuperAdmin.getAllUsers();
  res.status(200).json({
    message: "Users gotten successfully",
    users,
  })
};

export const getAllAdmins = async (req, res) => {
  const admins = await SuperAdmin.getAllAdmins();
  res.status(200).json({
    message: "Admins gotten successfully",
    admins
  })
};

export const getAllStaffs = async (req, res) => {
  const staffs = await SuperAdmin.getAllStaffs();
  res.status(200).json({
    message: "Staffs gotten successfully",
    staffs
  })
};
