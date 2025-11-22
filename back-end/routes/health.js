const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/health/db - lists tables and simple counts for key tables
router.get('/db', async (req, res) => {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);

    // Optionally fetch counts for core tables if they exist
    const counts = {};
    const core = ['Student','Tutor','Course','AvailabilitySlot','Booking'];
    for (const t of core) {
      if (tableNames.includes(t)) {
        try {
          const [rows] = await pool.query(`SELECT COUNT(*) AS count FROM ${t}`);
          counts[t] = rows[0].count;
        } catch (e) {
          counts[t] = 'error';
        }
      }
    }

    res.json({
      success: true,
      tables: tableNames,
      counts
    });
  } catch (error) {
    console.error('Health db error:', error);
    res.status(500).json({ success: false, error: 'Failed to query database' });
  }
});

module.exports = router;
