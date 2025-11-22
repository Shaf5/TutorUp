import React, { useState, useEffect } from 'react';
import { getAvailableSlotsByCourse, createBooking } from '../../services/api';

function CourseDetail({ course, studentId, onNavigate }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (course) {
      fetchSlots();
    }
  }, [course]);

  const fetchSlots = async () => {
    try {
      const result = await getAvailableSlotsByCourse(course.CourseID);
      
      if (result.success) {
        setSlots(result.data);
      } else {
        setError(result.error || 'Failed to load available slots');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slotId) => {
    setError('');
    setSuccess('');

    try {
      const result = await createBooking({
        studentId,
        slotId
      });

      if (result.success) {
        setSuccess('Booking created successfully!');
        fetchSlots();
        setTimeout(() => {
          onNavigate('student-sessions');
        }, 2000);
      } else {
        setError(result.error || 'Booking failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading available slots...</div>;
  }

  return (
    <div className="page-container">
      <h2>{course?.CourseName}</h2>
      <p><strong>Course Code:</strong> {course?.CourseCode}</p>
      {course?.Description && <p>{course.Description}</p>}

      <button className="btn btn-secondary" onClick={() => onNavigate('courses')}>
        Back to Courses
      </button>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <h3 style={{ marginTop: '30px' }}>Available Tutoring Slots</h3>

      {slots.length === 0 ? (
        <div className="empty-state">No available slots for this course</div>
      ) : (
        <div className="list-container">
          {slots.map((slot) => (
            <div key={slot.SlotID} className="list-item">
              <h4>{new Date(slot.Date).toLocaleDateString()}</h4>
              <p><strong>Time:</strong> {slot.StartTime} - {slot.EndTime}</p>
              <p><strong>Tutor:</strong> {slot.TutorName}</p>
              <p><strong>Location:</strong> {slot.Location}</p>
              <p><strong>Capacity:</strong> {slot.Capacity} students</p>
              <p><strong>Status:</strong> {slot.Status}</p>
              {slot.Status === 'Open' && (
                <button 
                  className="btn" 
                  onClick={() => handleBookSlot(slot.SlotID)}
                >
                  Book This Slot
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseDetail;
