import express from 'express';
import * as whatsappController from '../controllers/whatsappController.js';
import * as messageController from '../controllers/messageController.js';
import * as templateController from '../controllers/templateController.js';
import * as settingsController from '../controllers/settingsController.js';

const router = express.Router();

router.get('/qr', whatsappController.getQRCode);
router.get('/status', whatsappController.getStatus);
router.post('/disconnect', whatsappController.disconnect);
router.post('/send-message', whatsappController.sendMessage);

router.get('/messages', messageController.getAllMessages);
router.get('/messages/:phoneNumber', messageController.getMessagesByPhone);

router.get('/templates', templateController.getAllTemplates);
router.post('/templates', templateController.createTemplate);
router.put('/templates/:id', templateController.updateTemplate);
router.delete('/templates/:id', templateController.deleteTemplate);

router.get('/settings', settingsController.getAllSettings);
router.get('/settings/:key', settingsController.getSetting);
router.put('/settings', settingsController.updateSetting);

export default router;
