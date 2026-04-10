const Note = require('../models/Note');
const Lead = require('../models/Lead');

exports.getUpcomingFollowups = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const leadsQuery = req.user.role === 'admin' ? {} : { user: req.user.id };
    const leads = await Lead.find(leadsQuery).select('_id');
    const leadIds = leads.map(l => l._id);
    
    const notes = await Note.find({
      lead: { $in: leadIds },
      followUpDate: { $gte: today, $lte: nextWeek },
    })
      .populate('lead', 'name email')
      .sort({ followUpDate: 1 });
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};