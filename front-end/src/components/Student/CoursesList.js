import React, { useState, useEffect } from 'react';
import { getCoursesByMajor } from '../../services/api';

function CoursesList({ major, onNavigate, onSelectCourse }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (major) {
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [major]);

  const fetchCourses = async () => {
    try {
      const result = await getCoursesByMajor(major.MajorID);
      
      if (result.success) {
        setCourses(result.data);
      } else {
        setError(result.error || 'Failed to load courses');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    onSelectCourse(course);
    onNavigate('course-detail');
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  return (
    <div className="page-container">
      <h2>{major?.MajorName} Courses</h2>
      
      <button className="btn btn-secondary" onClick={() => onNavigate('majors')}>
        Back to Majors
      </button>

      {error && <div className="error-message">{error}</div>}

      {courses.length === 0 ? (
        <div className="empty-state">No courses available for this major</div>
      ) : (
        <div className="card-grid">
          {courses.map((course) => (
            <div
              key={course.CourseID}
              className="card"
              onClick={() => handleCourseClick(course)}
            >
              <h3>{course.CourseName}</h3>
              <p><strong>Course Code:</strong> {course.CourseCode}</p>
              {course.Description && <p>{course.Description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CoursesList;
