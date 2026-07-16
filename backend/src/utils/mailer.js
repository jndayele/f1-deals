const logger = require('./logger');

exports.sendResetPasswordEmail = async (to, resetUrl) => {
  try {
    const senderEmail = process.env.SENDER_EMAIL || 'ingawintiti@gmail.com';
    const senderName = process.env.SENDER_NAME || 'F1 Deals';
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
       logger.warn('BREVO_API_KEY not configured. Password reset email skipped.');
       return;
    }

    const payload = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject: "Password Reset Request",
      htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif">
  <table cellpadding="0" cellspacing="0" width="100%" style="background:#f9fafb;padding:40px 0">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" width="560" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
          <!-- Header -->
          <tr>
            <td style="background:#dc2626;padding:28px 32px">
              <p style="margin:0;color:#ffffff;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:600">F1 DEALS ADMIN</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700">Password Reset Request</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px">
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6">
                You recently requested to reset your password for your F1 Deals admin account. Click the button below to proceed.
              </p>
              
              <div style="text-align:center;margin:32px 0;">
                <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#dc2626;color:#ffffff;font-weight:600;text-decoration:none;border-radius:4px;font-size:15px">
                  Reset Password
                </a>
              </div>
              
              <p style="margin:0 0 16px;color:#6b7280;font-size:13px;line-height:1.6">
                If you're having trouble clicking the button, copy and paste the URL below into your web browser:
              </p>
              <div style="background:#f3f4f6;padding:12px;border-radius:4px;word-break:break-all">
                <a href="${resetUrl}" style="color:#2563eb;font-size:12px;text-decoration:none">${resetUrl}</a>
              </div>
              
              <p style="margin:24px 0 0;color:#9ca3af;font-size:13px">
                If you did not request a password reset, please ignore this email or contact support if you have concerns. This link will expire in 1 hour.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Brevo API Error: ${response.status} ${errorData}`);
    }

    logger.info({ to }, 'Password reset email sent via Brevo');
  } catch (error) {
    logger.error({ err: error }, "Failed to send reset email");
  }
};
