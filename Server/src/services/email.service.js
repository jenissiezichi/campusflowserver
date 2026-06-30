import { transporter } from "../configs/mailer.js";

const templates = {
  resetPassword: (otp) => ({
    subject: "Your Password OTP - Campus Flow",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f7; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
                <!-- Header Banner -->
                <tr>
                  <td align="center" style="background-color: #2563eb; padding: 30px 20px;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Campus Flow</h1>
                  </td>
                </tr>
                <!-- Content Area -->
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 20px; font-weight: 600;">Password Reset Request</h2>
                    <p style="margin: 0 0 24px 0; color: #64748b; font-size: 15px; line-height: 24px;">You requested a password reset. Use the One-Time Password (OTP) below to complete the process. This code will expire in <strong>10 minutes</strong>.</p>
                    
                    <!-- OTP Code Box -->
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 24px 0; display: inline-block;">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #2563eb; padding-left: 6px;">${otp}</span>
                    </div>
                    
                    <p style="margin: 24px 0 0 0; color: #94a3b8; font-size: 13px; line-height: 20px;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 0 30px 30px 30px; text-align: center;">
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0 0 20px 0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">&copy; 2026 Campus Flow. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  }),

  welcome: (name) => ({
    subject: "Welcome to Campus Flow! 🚀",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Campus Flow</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f7; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
                <!-- Header Banner -->
                <tr>
                  <td align="center" style="background-color: #2563eb; padding: 40px 20px;">
                    <span style="font-size: 40px; margin-bottom: 10px; display: block;">👋</span>
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Welcome to Campus Flow</h1>
                  </td>
                </tr>
                <!-- Content Area -->
                <tr>
                  <td style="padding: 40px 30px; text-align: left;">
                    <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 20px; font-weight: 600;">Hey ${name},</h2>
                    <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 24px;">We are excited to have you on board! Campus Flow is designed to help you seamlessly track your schedules, assignments, and campus updates all in one place.</p>
                    <p style="margin: 0 0 28px 0; color: #475569; font-size: 15px; line-height: 24px;">To get started, jump straight into your dashboard and explore your student tools.</p>
                    
                    <!-- Call To Action Button -->
                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td align="center" style="border-radius: 6px; background-color: #2563eb;">
                          <a href="#" target="_blank" style="display: inline-block; padding: 12px 30px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">Go to Dashboard</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 30px 30px 30px; text-align: center;">
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0 0 20px 0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">&copy; 2026 Campus Flow. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  })
};


export const sendEmail = async (to, templateName, data) => {
  const { subject, html } = templates[templateName](data);

  await transporter.sendMail({
    from: `"Campus Flow" <${process.env.GMAIL_USER}>`,
    to, subject, html
  })
}