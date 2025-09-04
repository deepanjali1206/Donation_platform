// server/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const Report = require('../models/Report');  // <-- fixed path

// Create a new report (from Contact Page)
router.post('/', async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all reports (for Admin Dashboard)
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
