import express from "express";
import { sendAlert } from "./alerta.js";
import {createIncidentReport} from '../controllers/solana.controllers.js'
import authMiddleware from '../middlewares/auth.middleware.js';

export const alerts = async (req, res) => {
    try {
        const { latitude, longitude, locationText } = req.body;   // ← channelRef removed from here
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const timestamp = new Date().toLocaleString("en-NG", {
            timeZone: "Africa/Lagos",
            dateStyle: "medium",
            timeStyle: "short",
        });
        const message = `
🚨 EMERGENCY ALERT 🚨
I need help!
📍Location :${locationText || 'See map link'}
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
        req.body.category = category
        req.body.locationText = locationText
        req.body.description = description
        req.body.latitude = latitude
        req.body.longitude = longitude
        await createIncidentReport(req, res)
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


const alertRoute = express.Router();
alertRoute.post("/telegram/send",authMiddleware, alerts);
alertRoute.post("/telegram/report", authMiddleware , reports);
export default alertRoute;