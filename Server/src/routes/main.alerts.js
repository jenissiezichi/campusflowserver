import express from "express";
import { createIncidentReport } from '../controllers/solana.controllers.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { sendAlert } from "./alerta.js";
import { sendEmail } from "../services/email.service.js";

import Incident from '../models/Incident.js';
import { reportIncident } from '../services/solanaService.js';
import crypto from 'crypto';

export const alerts = async (req, res) => {
    try {
        const { latitude, longitude, locationText } = req.body;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const timestamp = new Date().toLocaleString("en-NG", {
            timeZone: "Africa/Lagos", dateStyle: "medium", timeStyle: "short",
        });
        const message = `
🚨 EMERGENCY ALERT 🚨
I need help!
📍Location :${locationText || 'See map link'}
📍 My live location:
${mapsLink}
📅 Timestamp: ${timestamp}
`;
        const result = await sendAlert({ message, channelRef: process.env.ALERTA_CHANNEL_REF });

        try {
            const securityEmail = process.env.SECURITY_ALERT_EMAIL;
            await sendEmail(securityEmail, "sosAlert", {
                studentName: req.user.fullname,
                matricNumber: req.user.matric_number,
                locationText: locationText || mapsLink,
                description: "Emergency SOS triggered — immediate assistance required.",
            });
            console.log(req.user)
        } catch (emailErr) {
            console.error("SOS email failed (non-blocking):", emailErr.message);
        }

        const incidentId = crypto.randomUUID().replace(/-/g, '');
        const chainResult = await reportIncident({
            universityId: req.user.universityId,
            studentId: req.user.matricNumber,
            incidentId,
            studentName: req.user.fullname,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            description: "Emergency SOS",
        });

        const dbRecord = await Incident.create({
            incidentId,
            matric_number: req.user.matricNumber,
            studentName: req.user.fullname,
            category: "SOS Emergency",
            locationText: locationText || null,
            latitude,
            longitude,
            description: "Emergency SOS triggered",
            universityId: req.user.universityId,
            timestamp: Math.floor(Date.now() / 1000),
            txSignature: chainResult.tx,
            pdaAddress: chainResult.incidentPDA,
        });

        res.json({ success: true, message: "Alert Successfully Sent", data: result, incident: dbRecord });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
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
alertRoute.post("/telegram/send", authMiddleware, alerts);
alertRoute.post("/telegram/report", authMiddleware, reports);
export default alertRoute;


