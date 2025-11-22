const { pool } = require('../config/database');

const getTodaySlots = async (req, res) => {
  try {
    const [slots] = await pool.query(
      `SELECT 
          s.SlotID,
          s.Date,
          s.StartTime,
          s.EndTime,
          s.Capacity,
          s.Status,
          s.Location,
          c.CourseName,
          t.FullName AS TutorName
       FROM AvailabilitySlot s
       JOIN Course c ON s.CourseID = c.CourseID
       JOIN Tutor t ON s.TutorID = t.TutorID
       WHERE s.Date = CURDATE()
       ORDER BY s.StartTime`
    );

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots
    });
  } catch (error) {
    console.error('Get today slots error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching today\'s slots'
    });
  }
};

const getTomorrowSlots = async (req, res) => {
  try {
    const [slots] = await pool.query(
      `SELECT 
          s.SlotID,
          s.Date,
          s.StartTime,
          s.EndTime,
          s.Capacity,
          s.Status,
          s.Location,
          c.CourseName,
          t.FullName AS TutorName
       FROM AvailabilitySlot s
       JOIN Course c ON s.CourseID = c.CourseID
       JOIN Tutor t ON s.TutorID = t.TutorID
       WHERE s.Date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
       ORDER BY s.StartTime`
    );

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots
    });
  } catch (error) {
    console.error('Get tomorrow slots error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching tomorrow\'s slots'
    });
  }
};

module.exports = {
  getTodaySlots,
  getTomorrowSlots
};
