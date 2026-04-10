const Note = require('../models/Note');
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

exports.getNotesByLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    if (lead.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const notes = await Note.find({ lead: leadId })
      .sort({ createdAt: -1 })
      .populate('user', 'name');
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { text, followUpDate } = req.body;
    
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    if (lead.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const note = new Note({
      text,
      lead: leadId,
      user: req.user.id,
      followUpDate: followUpDate || null,
    });
    await note.save();
    
    await Activity.create({
      user: req.user.id,
      action: 'UPDATE',
      lead: leadId,
      details: `Added note to lead: ${lead.name}`,
    });
    
    const populatedNote = await Note.findById(note._id).populate('user', 'name');
    res.status(201).json(populatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};