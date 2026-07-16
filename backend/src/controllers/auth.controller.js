const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../config/prisma');
const { sendResetPasswordEmail } = require('../utils/mailer');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Email and password are required' } });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    }

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      success: true,
      data: { token, expiresIn: '24h' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Current and new password are required' } });
    }

    const admin = await prisma.admin.findUnique({ where: { id: req.adminId } });
    if (!admin) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Admin not found' } });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Incorrect current password' } });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: req.adminId },
      data: { password: hashedNewPassword }
    });

    res.status(200).json({
      success: true,
      data: { message: 'Password changed successfully' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Email is required' } });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      // Return 200 even if admin doesn't exist to prevent email enumeration
      return res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires
      }
    });

    // Frontend URL for resetting password
    const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',')[0] : 'http://localhost:5174';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendResetPasswordEmail(admin.email, resetUrl);

    res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Token and new password are required' } });
    }

    const admin = await prisma.admin.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() }
      }
    });

    if (!admin) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Password reset token is invalid or has expired' } });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedNewPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};
