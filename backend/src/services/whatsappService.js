import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode';
import { autoReplyService } from './autoReplyService.js';

class WhatsAppService {
  constructor() {
    this.client = null;
    this.qrCode = null;
    this.isReady = false;
    this.isInitializing = false;
  }

  initialize() {
    if (this.isInitializing || this.client) {
      console.log('WhatsApp client already initializing or initialized');
      return;
    }

    this.isInitializing = true;
    console.log('Initializing WhatsApp client...');

    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      }
    });

    this.client.on('qr', async (qr) => {
      console.log('QR Code received, generating image...');
      try {
        this.qrCode = await qrcode.toDataURL(qr);
        console.log('QR Code generated successfully');
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true;
      this.qrCode = null;
      this.isInitializing = false;
    });

    this.client.on('authenticated', () => {
      console.log('WhatsApp client authenticated');
      this.qrCode = null;
    });

    this.client.on('auth_failure', (msg) => {
      console.error('Authentication failure:', msg);
      this.isInitializing = false;
    });

    this.client.on('disconnected', (reason) => {
      console.log('WhatsApp client disconnected:', reason);
      this.isReady = false;
      this.qrCode = null;
      this.isInitializing = false;
    });

    this.client.on('message', async (message) => {
      await this.handleIncomingMessage(message);
    });

    this.client.initialize().catch((err) => {
      console.error('Error initializing WhatsApp client:', err);
      this.isInitializing = false;
    });
  }

  async handleIncomingMessage(message) {
    try {
      console.log(`Received message from ${message.from}: ${message.body}`);

      const contact = await message.getContact();
      const phoneNumber = message.from.replace('@c.us', '');
      const senderName = contact.pushname || contact.name || 'Unknown';
      const messageText = message.body;
      const messageType = message.type;

      const replyText = await autoReplyService.processMessage(
        phoneNumber,
        senderName,
        messageText,
        messageType
      );

      if (replyText && this.isReady) {
        await message.reply(replyText);
        console.log(`Sent auto-reply to ${phoneNumber}: ${replyText}`);
      }
    } catch (error) {
      console.error('Error handling incoming message:', error);
    }
  }

  async sendMessage(phoneNumber, message) {
    if (!this.isReady) {
      throw new Error('WhatsApp client is not ready');
    }

    try {
      const chatId = phoneNumber.includes('@c.us')
        ? phoneNumber
        : `${phoneNumber}@c.us`;

      await this.client.sendMessage(chatId, message);
      return { success: true, message: 'Message sent successfully' };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  getQRCode() {
    return this.qrCode;
  }

  getStatus() {
    return {
      isReady: this.isReady,
      isInitializing: this.isInitializing,
      hasQRCode: !!this.qrCode
    };
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.client = null;
      this.isReady = false;
      this.qrCode = null;
      this.isInitializing = false;
      console.log('WhatsApp client disconnected');
    }
  }
}

export const whatsappService = new WhatsAppService();
export default whatsappService;
