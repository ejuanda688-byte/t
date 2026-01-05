/*
  # WhatsApp Bot Auto-Reply Database Schema

  1. New Tables
    - `messages`
      - `id` (uuid, primary key) - Unique message identifier
      - `phone_number` (varchar) - Sender's phone number
      - `sender_name` (varchar) - Sender's display name
      - `message_text` (text) - Content of the message
      - `message_type` (varchar) - Type of message (text, image, etc.)
      - `timestamp` (timestamp) - When message was received
      - `is_replied` (boolean) - Whether bot has replied
      - `reply_text` (text) - The reply sent by bot
    
    - `auto_reply_templates`
      - `id` (uuid, primary key) - Unique template identifier
      - `keyword` (varchar) - Trigger keyword for auto-reply
      - `reply_message` (text) - Message to send as reply
      - `is_active` (boolean) - Whether template is active
      - `created_at` (timestamp) - When template was created
    
    - `bot_settings`
      - `id` (uuid, primary key) - Unique setting identifier
      - `setting_key` (varchar) - Setting name/key
      - `setting_value` (text) - Setting value
      - `updated_at` (timestamp) - Last update time

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated service access
    
  3. Initial Data
    - Default auto-reply templates for common keywords
    - Default bot settings
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number varchar(20) NOT NULL,
  sender_name varchar(255),
  message_text text NOT NULL,
  message_type varchar(50) DEFAULT 'text',
  timestamp timestamptz DEFAULT now(),
  is_replied boolean DEFAULT false,
  reply_text text
);

-- Create auto_reply_templates table
CREATE TABLE IF NOT EXISTS auto_reply_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword varchar(255) NOT NULL,
  reply_message text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create bot_settings table
CREATE TABLE IF NOT EXISTS bot_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key varchar(100) UNIQUE NOT NULL,
  setting_value text,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_reply_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages table
CREATE POLICY "Allow service role full access to messages"
  ON messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for auto_reply_templates table
CREATE POLICY "Allow service role full access to templates"
  ON auto_reply_templates
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for bot_settings table
CREATE POLICY "Allow service role full access to settings"
  ON bot_settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_phone_number ON messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_replied ON messages(is_replied);
CREATE INDEX IF NOT EXISTS idx_templates_keyword ON auto_reply_templates(keyword);
CREATE INDEX IF NOT EXISTS idx_templates_is_active ON auto_reply_templates(is_active);

-- Insert default auto-reply templates
INSERT INTO auto_reply_templates (keyword, reply_message, is_active) VALUES
('halo', 'Halo! Terima kasih telah menghubungi kami. Ada yang bisa kami bantu?', true),
('info', 'Untuk informasi lebih lanjut, silakan hubungi customer service kami.', true),
('jam', 'Kami buka Senin-Jumat pukul 09:00-17:00 WIB.', true),
('harga', 'Untuk informasi harga, silakan kirim pesan "INFO HARGA [nama produk]"', true),
('lokasi', 'Lokasi kantor kami ada di Jakarta Selatan. Untuk alamat lengkap silakan hubungi admin.', true)
ON CONFLICT DO NOTHING;

-- Insert default bot settings
INSERT INTO bot_settings (setting_key, setting_value) VALUES
('default_reply', 'Terima kasih atas pesan Anda. Kami akan segera merespons.'),
('bot_active', 'true'),
('welcome_message', 'Selamat datang! Bot WhatsApp kami siap membantu Anda.')
ON CONFLICT (setting_key) DO NOTHING;