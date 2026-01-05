# WhatsApp Bot Auto-Reply Backend

Backend API untuk WhatsApp Bot Auto-Reply menggunakan Node.js, Express, dan Supabase.

## Features

- WhatsApp Web Integration menggunakan `whatsapp-web.js`
- Auto-reply berdasarkan keyword matching
- Menyimpan semua chat history ke Supabase
- CRUD auto-reply templates
- Bot settings management
- QR Code authentication
- RESTful API endpoints

## Tech Stack

- Node.js
- Express.js
- WhatsApp Web.js
- Supabase (PostgreSQL)
- QRCode

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js          # Supabase client configuration
│   ├── controllers/
│   │   ├── messageController.js  # Message handling logic
│   │   ├── settingsController.js # Settings management
│   │   ├── templateController.js # Template CRUD operations
│   │   └── whatsappController.js # WhatsApp connection logic
│   ├── services/
│   │   ├── autoReplyService.js  # Auto-reply logic & message processing
│   │   └── whatsappService.js   # WhatsApp client management
│   ├── routes/
│   │   └── index.js             # API routes definition
│   └── server.js                # Main application entry point
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- WhatsApp account

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
The `.env` file is already configured with your Supabase credentials.

4. Database setup:
Database schema has been automatically created in your Supabase instance with the following tables:
- `messages` - Stores all incoming WhatsApp messages
- `auto_reply_templates` - Stores keyword-based reply templates
- `bot_settings` - Stores bot configuration settings

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## First Time Setup

1. Start the backend server:
```bash
npm run dev
```

2. Open your browser and go to:
```
http://localhost:5000/api/qr
```

3. You will see a QR code in the response. Scan it with your WhatsApp mobile app:
   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices
   - Tap "Link a Device"
   - Scan the QR code from the API response

4. Once connected, the bot will start listening for incoming messages

## API Endpoints

### WhatsApp Connection

#### Get QR Code
```
GET /api/qr
```
Returns QR code for WhatsApp authentication.

**Response:**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,..."
}
```

#### Get Connection Status
```
GET /api/status
```
Returns current WhatsApp connection status.

**Response:**
```json
{
  "success": true,
  "status": {
    "isReady": true,
    "isInitializing": false,
    "hasQRCode": false
  }
}
```

#### Disconnect WhatsApp
```
POST /api/disconnect
```
Disconnects WhatsApp client.

#### Send Message
```
POST /api/send-message
```
Send a message to a phone number.

**Request Body:**
```json
{
  "phoneNumber": "628123456789",
  "message": "Hello from bot!"
}
```

### Messages

#### Get All Messages
```
GET /api/messages?limit=100&offset=0
```
Returns paginated list of all messages.

**Query Parameters:**
- `limit` (optional): Number of messages to return (default: 100)
- `offset` (optional): Offset for pagination (default: 0)
- `phone_number` (optional): Filter by phone number

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 150,
  "limit": 100,
  "offset": 0
}
```

#### Get Messages by Phone Number
```
GET /api/messages/:phoneNumber
```
Returns all messages from a specific phone number.

### Auto-Reply Templates

#### Get All Templates
```
GET /api/templates
```
Returns all auto-reply templates.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "keyword": "halo",
      "reply_message": "Halo! Ada yang bisa kami bantu?",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Template
```
POST /api/templates
```

**Request Body:**
```json
{
  "keyword": "promo",
  "reply_message": "Cek promo terbaru kami di website!",
  "is_active": true
}
```

#### Update Template
```
PUT /api/templates/:id
```

**Request Body:**
```json
{
  "keyword": "promo",
  "reply_message": "Updated reply message",
  "is_active": false
}
```

#### Delete Template
```
DELETE /api/templates/:id
```

### Bot Settings

#### Get All Settings
```
GET /api/settings
```
Returns all bot settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "bot_active": "true",
    "default_reply": "Terima kasih atas pesan Anda.",
    "welcome_message": "Selamat datang!"
  }
}
```

#### Get Single Setting
```
GET /api/settings/:key
```
Returns a specific setting by key.

#### Update Setting
```
PUT /api/settings
```

**Request Body:**
```json
{
  "setting_key": "bot_active",
  "setting_value": "false"
}
```

## How Auto-Reply Works

1. Bot receives a message from WhatsApp
2. Checks if bot is active in settings
3. Searches for keyword match in active templates
4. If keyword found, sends the corresponding reply
5. If no keyword match, sends default reply
6. Saves message and reply to database

**Keyword Matching:**
- Case-insensitive
- Searches if keyword is contained in message
- First matching template is used
- Example: Message "Halo kak" will match keyword "halo"

## Default Templates

The database comes pre-populated with these templates:

| Keyword | Reply Message |
|---------|---------------|
| halo | Halo! Terima kasih telah menghubungi kami. Ada yang bisa kami bantu? |
| info | Untuk informasi lebih lanjut, silakan hubungi customer service kami. |
| jam | Kami buka Senin-Jumat pukul 09:00-17:00 WIB. |
| harga | Untuk informasi harga, silakan kirim pesan "INFO HARGA [nama produk]" |
| lokasi | Lokasi kantor kami ada di Jakarta Selatan. |

## Troubleshooting

### QR Code Not Showing
- Make sure server is running
- Check if WhatsApp client is already authenticated
- Try restarting the server

### Bot Not Replying
- Check bot_active setting: `GET /api/settings`
- Verify templates are active: `GET /api/templates`
- Check server logs for errors

### Authentication Issues
- Delete `.wwebjs_auth` folder and restart
- Make sure you're using the latest WhatsApp version on your phone
- Try using a different browser to scan QR code

### Database Connection Issues
- Verify Supabase credentials in `.env`
- Check Supabase dashboard for database status
- Ensure Row Level Security policies are correctly set

## Security Notes

- Never commit `.env` file to version control
- Service Role Key should only be used on backend
- Validate and sanitize all user inputs
- Implement rate limiting in production
- Use HTTPS in production

## Production Deployment

### Recommended Platforms
- Railway
- Heroku
- DigitalOcean
- AWS EC2
- VPS

### Environment Variables to Set
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5000
NODE_ENV=production
```

### Important Notes
- Ensure server stays running (use PM2 or similar)
- WhatsApp session persists in `.wwebjs_auth` folder
- Backup `.wwebjs_auth` folder to avoid re-authentication
- Monitor server logs for issues

## Performance Tips

- Enable database indexes (already configured)
- Implement caching for frequently accessed templates
- Use connection pooling for database
- Monitor memory usage (WhatsApp client can be memory-intensive)
- Implement rate limiting for API endpoints

## Next Steps

1. Test all API endpoints with Postman or Thunder Client
2. Build the frontend dashboard
3. Implement additional features:
   - Message scheduling
   - Broadcast messages
   - Analytics dashboard
   - Multi-keyword matching
   - Rich message support (images, documents)

## Support

For issues and questions, check the logs:
```bash
npm run dev
```

The server logs will show:
- WhatsApp connection status
- Incoming messages
- Auto-reply matches
- Database operations
- API requests

## License

MIT
