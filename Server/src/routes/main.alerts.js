import express from "express";
import { sendAlert } from "./alerta.js";

export const alerts = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;   // ← channelRef removed from here
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const timestamp = new Date().toLocaleString("en-NG", {
            timeZone: "Africa/Lagos",
            dateStyle: "medium",
            timeStyle: "short",
        });
        const message = `
🚨 EMERGENCY ALERT 🚨
I need help!
📍 My live location:
${mapsLink}
📅 Timestamp: ${timestamp}
`;
        const result = await sendAlert({
            message,
            channelRef: process.env.ALERTA_CHANNEL_REF,   // ← added
        });
        res.json({
            success: true,
            message: "Alert Successfully Sent",
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};




export const reports = async (req, res) => {
    try {
        const { category, locationText, description } = req.body;
        const { latitude, longitude } = req.body;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const timestamp = new Date().toLocaleString("en-NG", {
            timeZone: "Africa/Lagos",
            dateStyle: "medium",
            timeStyle: "short",
        });
        const message = `
📋 ${category.toUpperCase()} REPORT
📍 Location: ${locationText}
📝 ${description}
📅 Timestamp: ${timestamp}
📍 My live location:
${mapsLink}
`;
        const result = await sendAlert({
            message,
            channelRef: process.env.ALERTA_CHANNEL_REF,
        });
        res.json({ success: true, message: "Report sent", data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


const alertRoute = express.Router();
alertRoute.post("/telegram/send", alerts);
alertRoute.post("/telegram/report", reports);
export default alertRoute;