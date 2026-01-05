# Quick Start Guide - WhatsApp Bot Backend

Panduan cepat untuk menjalankan WhatsApp Bot dalam 5 menit!

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Start Server

```bash
npm run dev
```

Anda akan melihat output seperti ini:
```
Server is running on port 5000
Environment: development
Initializing WhatsApp client...
QR Code received, generating image...
QR Code generated successfully
```

## Step 3: Scan QR Code

### Option A: Via Browser (Recommended)
1. Buka browser dan akses: `http://localhost:5000/api/qr`
2. Copy QR code base64 string dari response
3. Paste ke [Base64 to Image Converter](https://codebeautify.org/base64-to-image-converter)
4. Scan QR code dengan WhatsApp di HP Anda

### Option B: Via Postman/Thunder Client
1. Buka Postman atau Thunder Client
2. Buat GET request ke `http://localhost:5000/api/qr`
3. Copy QR code dan scan dengan WhatsApp

### Cara Scan di WhatsApp:
1. Buka WhatsApp di HP
2. Tap menu (3 titik) > Linked Devices
3. Tap "Link a Device"
4. Scan QR code yang muncul

## Step 4: Verify Connection

```bash
curl http://localhost:5000/api/status
```

Response:
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

## Step 5: Test Auto-Reply

1. Kirim pesan WhatsApp ke nomor yang sudah di-scan dari HP lain
2. Coba kirim keyword: "halo", "info", "jam"
3. Bot akan otomatis membalas!

## Monitoring

Server logs akan menampilkan:
```
Received message from 628123456789: halo
Matched keyword: halo
Sent auto-reply to 628123456789: Halo! Terima kasih telah menghubungi kami...
Message saved to database
```

## Testing with cURL

### Get all messages:
```bash
curl http://localhost:5000/api/messages
```

### Get all templates:
```bash
curl http://localhost:5000/api/templates
```

### Create new template:
```bash
curl -X POST http://localhost:5000/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "promo",
    "reply_message": "Cek promo terbaru di website kami!",
    "is_active": true
  }'
```

### Update bot settings:
```bash
curl -X PUT http://localhost:5000/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "setting_key": "default_reply",
    "setting_value": "Terima kasih! Kami akan segera merespons."
  }'
```

## Common Issues

### Port already in use
```bash
# Change PORT in .env file
PORT=3000
```

### QR Code expired
Restart server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Bot not replying
Check bot status:
```bash
curl http://localhost:5000/api/settings
```

If `bot_active` is `false`, enable it:
```bash
curl -X PUT http://localhost:5000/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "setting_key": "bot_active",
    "setting_value": "true"
  }'
```

## Next Steps

- ✅ Backend is running
- ✅ WhatsApp is connected
- ✅ Auto-reply is working
- 📱 Build frontend dashboard (coming next!)
- 🚀 Deploy to production

## Pro Tips

1. **Keep server running**: Use PM2 in production
2. **Backup session**: Copy `.wwebjs_auth` folder to avoid re-scanning
3. **Monitor logs**: Always check console for errors
4. **Test templates**: Create multiple keywords for different scenarios
5. **Database check**: Use Supabase dashboard to view saved messages

## Support

Stuck? Check:
1. Server logs for errors
2. Supabase dashboard for database issues
3. WhatsApp connection status via `/api/status`
4. Network/firewall settings

Happy coding! 🎉
