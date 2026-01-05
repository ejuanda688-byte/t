import autoReplyService from '../services/autoReplyService.js';

export const getAllMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const phoneNumber = req.query.phone_number;

    let result;

    if (phoneNumber) {
      const messages = await autoReplyService.getMessagesByPhone(phoneNumber);
      result = { messages, total: messages.length };
    } else {
      result = await autoReplyService.getAllMessages(limit, offset);
    }

    res.json({
      success: true,
      data: result.messages,
      total: result.total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

export const getMessagesByPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const messages = await autoReplyService.getMessagesByPhone(phoneNumber);

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};
