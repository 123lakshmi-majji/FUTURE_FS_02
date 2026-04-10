const Lead = require('../models/Lead');
const { Parser } = require('json2csv');

exports.exportLeadsToCSV = async (req, res) => {
  try {
    const { search, status, source } = req.query;
    
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
    
    const leads = await Lead.find(query).populate('user', 'name');
    
    const leadsData = leads.map(lead => ({
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phone,
      Source: lead.source,
      Status: lead.status,
      'Created Date': lead.createdAt.toISOString().split('T')[0],
      'Owner': lead.user?.name || 'Unknown',
    }));
    
    const parser = new Parser();
    const csv = parser.parse(leadsData);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Export failed' });
  }
};