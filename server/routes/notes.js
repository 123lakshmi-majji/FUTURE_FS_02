// server/routes/notes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { createNote } = require('../controllers/noteController');

router.use(authMiddleware);
router.post('/:leadId', createNote);

module.exports = router;