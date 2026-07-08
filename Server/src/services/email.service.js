import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const templates = {
  welcome: (name) => ({
    subject: 'Welcome to CampusFlow 🎓',
    html:`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 30px; border-radius: 12px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to CampusFlow</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b;">Hello, ${name}! 👋</h2>
            <p style="color: #64748b;">Your account has been created successfully. You can now access all CampusFlow features.</p>
            <a href="${process.env.FRONTEND_URL}"
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
              Go to Dashboard
            </a>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">CampusFlow — Blockchain-powered University Management</p>
          </div>
        </div>`
  }),

  sosAlert: ({studentName, matricNumber, locationText, description}) => ({
    subject: '🚨 SOS Alert - Immediate Attention Required',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #dc2626; padding: 30px; border-radius: 12px; text-align: center;">
        <h1 style="color: white; margin: 0;">🚨 SOS Alert</h1>
      </div>
      <div style="padding: 30px; background: #fef2f2; border-radius: 0 0 12px 12px;">
        <p><strong>Student:</strong> ${studentName} (${matricNumber})</p>
         <p><strong>Matric Number:</strong> ${matricNumber}</p>
        <p><strong>Location:</strong> ${locationText}</p>
        <p><strong>Details:</strong> ${description}</p>
        <p style="color: #dc2626; font-weight: bold;">Please respond immediately.</p>
      </div>
    </div>`
  }),

  resetPassword: (otp) => ({
    subject: 'Reset Your CampusFlow Password',
    html:`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 30px; border-radius: 12px; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc; border-radius: 0 0 12px 12px;">
            <p style="color: #64748b;">Use the OTP below to reset your password. It expires in 15 minutes.</p>
            <div style="background: #1e40af; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, ignore this email.</p>
          </div>
        </div>`
  }),
};

export const sendEmail = async (to, templateName, data) => {
  const template = templates[templateName](data);
  const { data: result, error } = await resend.emails.send({
    from: 'CampusFlow <campusflow-noreply@jenissi.me>',
    to,
    subject: template.subject,
    html: template.html,
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error(error.message);
  }

  return result;
};

