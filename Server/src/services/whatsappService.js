import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();
const client =twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export const sendIncidentAlert = async (incident) => {
    try {
        const message = `
        *CampusFlow SOS ALERT*
     
     _Student_ : ${incident.student_name}
     _ID_ : ${incident.student_id}
     _Location : ${incident.latitude}, ${incident.longitude}
     _Description : ${incident.description}
     _Time_ : ${new Date().toLocaleDateString()}
     
     Please Respond Immediately!!!!!.
        `;
    await client.messages.create({
        from:process.env.TWILIO_WHATSAPP_FROM,
        to:process.env.SECURITY_WHATSAPP,
        body:message,
    })
        console.log("Whatsapp Message successfully sent!");
    }catch(err) {
        console.error("Whatsapp alert Failed!",err);
    }
};