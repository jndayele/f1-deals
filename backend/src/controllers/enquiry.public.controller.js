const prisma = require('../config/prisma');
const { emailQueue } = require('../config/queues');
const socket = require('../config/socket');

exports.submitEnquiry = async (req, res) => {
  try {
    const { name, phoneNumber, email, message, type, carId, carName } = req.body;

    if (!name || !phoneNumber || !message || !type) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Required fields missing' } });
    }

    // Normalise type to match the Prisma enum (Financing | TradeIn | General)
    const TYPE_MAP = {
      financing: 'Financing',
      'trade-in': 'TradeIn',
      tradein: 'TradeIn',
      general: 'General',
      Financing: 'Financing',
      TradeIn: 'TradeIn',
      General: 'General',
    };

    const normalisedType = TYPE_MAP[type];
    if (!normalisedType) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid enquiry type' } });
    }

    const enquiry = await prisma.enquiry.create({
      data: { name, phoneNumber, email, message, type: normalisedType }
    });

    await emailQueue.add('send-enquiry-email', {
      enquiryId: enquiry.id,
      name,
      phoneNumber,
      email,
      message,
      type: normalisedType,
      carId: carId || null,
      carName: carName || null,
    }, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 }
    });

    try {
      socket.getIO().emit('new_enquiry', enquiry);
    } catch (e) {
      console.error('Socket error emitting new_enquiry:', e);
    }

    res.status(201).json({
      success: true,
      data: { message: 'Enquiry submitted successfully' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};
