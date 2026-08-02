const supabase = require('../config/supabase');

/**
 * Change password for the currently authenticated admin.
 * Login, forgot-password, and reset-password are now handled
 * entirely by the Supabase client on the frontend — no backend
 * endpoints are needed for those flows.
 */
exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'newPassword must be at least 8 characters' }
      });
    }

    // req.adminId is the Supabase user UUID, set by requireAdmin middleware
    const { error } = await supabase.auth.admin.updateUserById(req.adminId, {
      password: newPassword,
    });

    if (error) {
      console.error('Supabase changePassword error:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update password' }
      });
    }

    res.status(200).json({
      success: true,
      data: { message: 'Password changed successfully' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' }
    });
  }
};
