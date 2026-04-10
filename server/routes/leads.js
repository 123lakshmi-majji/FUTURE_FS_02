// server/routes/leads.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getLeads, createLead, updateLead, deleteLead } = require('../controllers/leadController');
const { getNotesByLead } = require('../controllers/noteController');

router.use(authMiddleware);

router.get('/', getLeads);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);
router.get('/:leadId/notes', getNotesByLead);

module.exports = router;