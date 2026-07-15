const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

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
