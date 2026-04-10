// server/routes/followups.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getUpcomingFollowups } = require('../controllers/followupController');

router.use(authMiddleware);
router.get('/upcoming', getUpcomingFollowups);

module.exports = router;