import whatsappService from '../services/whatsappService.js';

export const getQRCode = async (req, res) => {
  try {
    const qrCode = whatsappService.getQRCode();

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not available. Client may already be authenticated.'
      });
    }

    res.json({
      success: true,
      qrCode
    });
  } catch (error) {
    console.error('Error getting QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting QR code',
      error: error.message
    });
  }
};

export const getStatus = async (req, res) => {
  try {
    const status = whatsappService.getStatus();

    res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Error getting status:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting status',
      error: error.message
    });
  }
};

export const disconnect = async (req, res) => {
  try {
    await whatsappService.disconnect();

    res.json({
      success: true,
      message: 'WhatsApp client disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting:', error);
    res.status(500).json({
      success: false,
      message: 'Error disconnecting WhatsApp client',
      error: error.message
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and message are required'
      });
    }

    const result = await whatsappService.sendMessage(phoneNumber, message);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};
