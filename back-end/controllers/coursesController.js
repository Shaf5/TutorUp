const { pool } = require('../config/database');

const getAllMajors = async (req, res) => {
  try {
    const [majors] = await pool.query(
      'SELECT MajorID, MajorName FROM Major ORDER BY MajorName'
    );

    res.status(200).json({
      success: true,
      count: majors.length,
      data: majors
    });
  } catch (error) {
    console.error('Get majors error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching majors'
    });
  }
};

const getCoursesByMajor = async (req, res) => {
  try {
    const { majorId } = req.params;

    const [courses] = await pool.query(
      `SELECT CourseID, CourseCode, CourseName, Description 
       FROM Course 
       WHERE MajorID = ? 
       ORDER BY CourseCode`,
      [majorId]
    );

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get courses by major error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching courses'
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const [courses] = await pool.query(
      'SELECT CourseName, Description FROM Course WHERE CourseID = ?',
      [courseId]
    );

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: courses[0]
    });
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching course'
    });
  }
};

const getAvailableSlotsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const [slots] = await pool.query(
      `SELECT s.SlotID,
              s.Date,
              s.StartTime,
              s.EndTime,
              s.Location,
              s.Capacity,
              t.FullName AS TutorName,
              t.TutorID
       FROM AvailabilitySlot s
       JOIN Tutor t ON s.TutorID = t.TutorID
       WHERE s.CourseID = ? AND s.Status = 'Open'
       ORDER BY s.Date, s.StartTime`,
      [courseId]
    );

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching slots'
    });
  }
};

module.exports = {
  getAllMajors,
  getCoursesByMajor,
  getCourseById,
  getAvailableSlotsByCourse
};
