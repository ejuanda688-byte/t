import supabase from '../config/supabase.js';

export const getAllSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bot_settings')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    const settingsObj = {};
    data.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    res.json({
      success: true,
      data: settingsObj
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const { setting_key, setting_value } = req.body;

    if (!setting_key || setting_value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Setting key and value are required'
      });
    }

    const { data: existing } = await supabase
      .from('bot_settings')
      .select('id')
      .eq('setting_key', setting_key)
      .maybeSingle();

    let data, error;

    if (existing) {
      const result = await supabase
        .from('bot_settings')
        .update({
          setting_value,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', setting_key)
        .select()
        .single();

      data = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from('bot_settings')
        .insert({
          setting_key,
          setting_value
        })
        .select()
        .single();

      data = result.data;
      error = result.error;
    }

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Setting updated successfully',
      data
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating setting',
      error: error.message
    });
  }
};

export const getSetting = async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'Setting key is required'
      });
    }

    const { data, error } = await supabase
      .from('bot_settings')
      .select('*')
      .eq('setting_key', key)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching setting',
      error: error.message
    });
  }
};
