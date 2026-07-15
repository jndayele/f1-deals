const prisma = require('../config/prisma');
const { emailQueue } = require('../config/queues');

exports.submitEnquiry = async (req, res) => {
  try {
    const { name, phoneNumber, email, message, type } = req.body;

    if (!name || !phoneNumber || !message || !type) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Required fields missing' } });
    }

    if (!['Financing', 'TradeIn', 'General'].includes(type)) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid type' } });
    }

    const enquiry = await prisma.enquiry.create({
      data: { name, phoneNumber, email, message, type }
    });

    await emailQueue.add('send-enquiry-email', {
      enquiryId: enquiry.id,
      name,
      phoneNumber,
      email,
      message,
      type
    }, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 }
    });

    res.status(201).json({
      success: true,
      data: { message: 'Enquiry submitted successfully' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};
