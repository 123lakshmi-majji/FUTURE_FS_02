// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const noteRoutes = require('./routes/notes');
const activityRoutes = require('./routes/activities');
const exportRoutes = require('./routes/export');
const followupRoutes = require('./routes/followups');
const errorHandler = require('./middleware/error');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/followups', followupRoutes);

// Error handling
app.use(errorHandler);

// ✅ Export for Vercel (no app.listen)
module.exports = app;
