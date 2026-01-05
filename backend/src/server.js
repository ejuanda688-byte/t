import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import whatsappService from './services/whatsappService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'WhatsApp Bot API is running',
    version: '1.0.0',
    endpoints: {
      qr: '/api/qr',
      status: '/api/status',
      messages: '/api/messages',
      templates: '/api/templates',
      settings: '/api/settings'
    }
  });
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Initializing WhatsApp client...');

  whatsappService.initialize();
});

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await whatsappService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await whatsappService.disconnect();
  process.exit(0);
});

export default app;
