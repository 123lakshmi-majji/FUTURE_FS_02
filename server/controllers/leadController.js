const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

const logActivity = async (userId, action, leadId, details) => {
  const activity = new Activity({
    user: userId,
    action,
    lead: leadId,
    details,
  });
  await activity.save();
};

exports.getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, source, sortField = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (status) query.status = status;
    if (source) query.source = source;
    
    const sortOptions = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
    
    const leads = await Lead.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email');
    
    const total = await Lead.countDocuments(query);
    
    res.json({
      leads,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createLead = async (req, res) => {
  try {
    const lead = new Lead({
      ...req.body,
      user: req.user.id,
    });
    await lead.save();
    
    await logActivity(req.user.id, 'CREATE', lead._id, `Created lead: ${lead.name}`);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    if (lead.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    await logActivity(req.user.id, 'UPDATE', lead._id, `Updated lead: ${lead.name}`);
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    if (lead.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await lead.deleteOne();
    await logActivity(req.user.id, 'DELETE', lead._id, `Deleted lead: ${lead.name}`);
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('user', 'name email');
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (lead.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
