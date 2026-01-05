import supabase from '../config/supabase.js';

class AutoReplyService {
  async processMessage(phoneNumber, senderName, messageText, messageType) {
    try {
      const botActive = await this.isBotActive();
      if (!botActive) {
        console.log('Bot is not active, skipping auto-reply');
        await this.saveMessage(phoneNumber, senderName, messageText, messageType, false, null);
        return null;
      }

      const replyText = await this.findMatchingReply(messageText);

      await this.saveMessage(phoneNumber, senderName, messageText, messageType, !!replyText, replyText);

      return replyText;
    } catch (error) {
      console.error('Error processing message:', error);
      return null;
    }
  }

  async findMatchingReply(messageText) {
    try {
      const { data: templates, error } = await supabase
        .from('auto_reply_templates')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching templates:', error);
        return await this.getDefaultReply();
      }

      if (!templates || templates.length === 0) {
        return await this.getDefaultReply();
      }

      const messageLower = messageText.toLowerCase().trim();

      for (const template of templates) {
        const keywordLower = template.keyword.toLowerCase().trim();

        if (messageLower.includes(keywordLower)) {
          console.log(`Matched keyword: ${template.keyword}`);
          return template.reply_message;
        }
      }

      return await this.getDefaultReply();
    } catch (error) {
      console.error('Error finding matching reply:', error);
      return await this.getDefaultReply();
    }
  }

  async saveMessage(phoneNumber, senderName, messageText, messageType, isReplied, replyText) {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          phone_number: phoneNumber,
          sender_name: senderName,
          message_text: messageText,
          message_type: messageType,
          is_replied: isReplied,
          reply_text: replyText,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving message:', error);
      } else {
        console.log('Message saved to database');
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }

  async isBotActive() {
    try {
      const { data, error } = await supabase
        .from('bot_settings')
        .select('setting_value')
        .eq('setting_key', 'bot_active')
        .maybeSingle();

      if (error) {
        console.error('Error checking bot status:', error);
        return true;
      }

      return data?.setting_value === 'true';
    } catch (error) {
      console.error('Error checking bot status:', error);
      return true;
    }
  }

  async getDefaultReply() {
    try {
      const { data, error } = await supabase
        .from('bot_settings')
        .select('setting_value')
        .eq('setting_key', 'default_reply')
        .maybeSingle();

      if (error) {
        console.error('Error fetching default reply:', error);
        return 'Terima kasih atas pesan Anda. Kami akan segera merespons.';
      }

      return data?.setting_value || 'Terima kasih atas pesan Anda. Kami akan segera merespons.';
    } catch (error) {
      console.error('Error fetching default reply:', error);
      return 'Terima kasih atas pesan Anda. Kami akan segera merespons.';
    }
  }

  async getAllMessages(limit = 100, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .order('timestamp', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      return { messages: data, total: count };
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async getMessagesByPhone(phoneNumber) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('phone_number', phoneNumber)
        .order('timestamp', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching messages by phone:', error);
      throw error;
    }
  }
}

export const autoReplyService = new AutoReplyService();
export default autoReplyService;
