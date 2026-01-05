import supabase from '../config/supabase.js';

export const getAllTemplates = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('auto_reply_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching templates',
      error: error.message
    });
  }
};

export const createTemplate = async (req, res) => {
  try {
    const { keyword, reply_message, is_active } = req.body;

    if (!keyword || !reply_message) {
      return res.status(400).json({
        success: false,
        message: 'Keyword and reply message are required'
      });
    }

    const { data, error } = await supabase
      .from('auto_reply_templates')
      .insert({
        keyword,
        reply_message,
        is_active: is_active !== undefined ? is_active : true
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating template',
      error: error.message
    });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { keyword, reply_message, is_active } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Template ID is required'
      });
    }

    const updates = {};
    if (keyword !== undefined) updates.keyword = keyword;
    if (reply_message !== undefined) updates.reply_message = reply_message;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data, error } = await supabase
      .from('auto_reply_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.json({
      success: true,
      message: 'Template updated successfully',
      data
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating template',
      error: error.message
    });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Template ID is required'
      });
    }

    const { error } = await supabase
      .from('auto_reply_templates')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting template',
      error: error.message
    });
  }
};
