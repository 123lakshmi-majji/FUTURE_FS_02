// server/routes/export.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { exportLeadsToCSV } = require('../controllers/exportController');

router.use(authMiddleware);
router.get('/leads', exportLeadsToCSV);

module.exports = router;