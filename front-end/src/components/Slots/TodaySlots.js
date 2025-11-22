import React, { useState, useEffect } from 'react';
import { getTodaySlots } from '../../services/api';

function TodaySlots({ onNavigate }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const result = await getTodaySlots();
      
      if (result.success) {
        setSlots(result.data);
      } else {
        setError(result.error || 'Failed to load today\'s slots');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading today's slots...</div>;
  }

  return (
    <div className="page-container">
      <h2>Today's Tutoring Slots</h2>

      {error && <div className="error-message">{error}</div>}

      {slots.length === 0 ? (
        <div className="empty-state">No slots available today</div>
      ) : (
        <div className="list-container">
          {slots.map((slot) => (
            <div key={slot.SlotID} className="list-item">
              <h4>{slot.CourseName}</h4>
              <p><strong>Date:</strong> {new Date(slot.Date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {slot.StartTime} - {slot.EndTime}</p>
              <p><strong>Tutor:</strong> {slot.TutorName}</p>
              <p><strong>Location:</strong> {slot.Location}</p>
              <p><strong>Capacity:</strong> {slot.Capacity} students</p>
              <p><strong>Status:</strong> <span style={{ 
                color: slot.Status === 'Open' ? 'green' : slot.Status === 'Full' ? 'red' : 'orange',
                fontWeight: 'bold'
              }}>{slot.Status}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TodaySlots;
