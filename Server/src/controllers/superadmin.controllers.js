import SuperAdmin from "../models/superadmin.models.js";
import { connection } from "../configs/solana.js";
import os from "os";

export const getAllStudents = async (req, res) => {
  try {
    const users = await SuperAdmin.getAllStudents();
    return res.status(200).json({
      message: "Students gotten successfully",
      count: users.length,
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

export const getAllDocuments = async (req, res) => {
  try {
    const documents = await SuperAdmin.getAllDocuments();
    return res.status(200).json({
      message: "Documents gotten successfully",
      documents,
    });
  } catch (err) {
    return res.status(500).json({
      message: err?.message || "Internal server error while fetching documents",
    });
  }
};

export const getSystemHealth = async (req, res) => {
  const health = {
    database: { status: "down", latencyMs: null },
    solana: { status: "down", latencyMs: null, slot: null },
    uptimeSeconds: Math.floor(process.uptime()),
    memory: process.memoryUsage(),
  };

  try {
    health.database.latencyMs = await SuperAdmin.checkDbHealth();
    health.database.status = "healthy";
  } catch (err) {
    health.database.error = err.message;
  }

  try {
    const start = Date.now();
    const slot = await connection.getSlot();
    health.solana.latencyMs = Date.now() - start;
    health.solana.slot = slot;
    health.solana.status = "healthy";
  } catch (err) {
    health.solana.error = err.message;
  }

  res.status(200).json({
    success: true,
    health,
  });
};