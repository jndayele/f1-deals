const nodemailer = require('nodemailer');

exports.sendResetPasswordEmail = async (to, resetUrl) => {
  try {
    // Use real SMTP credentials from .env
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: '"F1 Deals Admin" <admin@f1deals.com>',
      to: to,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset for your admin account.</p>
        <p>Click the link below to set a new password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#dc2626;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
        <br/><br/>
        <p>Or copy this link into your browser: <br/>${resetUrl}</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    console.log("-----------------------------------------");
    console.log("✉️  PASSWORD RESET EMAIL SENT!");
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("Failed to send reset email:", error);
  }
};
