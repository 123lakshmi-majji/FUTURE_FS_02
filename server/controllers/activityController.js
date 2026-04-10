const Activity = require('../models/Activity');

exports.getActivities = async (req, res) => {
  try {
    const query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }
    
    const activities = await Activity.find(query)
      .sort({ timestamp: -1 })
      .limit(50)
      .populate('user', 'name')
      .populate('lead', 'name');
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};