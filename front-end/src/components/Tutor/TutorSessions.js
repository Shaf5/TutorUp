import React, { useState, useEffect } from 'react';
import { getTutorUpcomingSessions, getTutorPastSessions } from '../../services/api';

function TutorSessions({ tutorId, onNavigate }) {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorId]);

  const fetchSessions = async () => {
    try {
      const [upcomingResult, pastResult] = await Promise.all([
        getTutorUpcomingSessions(tutorId),
        getTutorPastSessions(tutorId)
      ]);

      if (upcomingResult.success) {
        setUpcomingSessions(upcomingResult.data);
      }
      if (pastResult.success) {
        setPastSessions(pastResult.data);
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading sessions...</div>;
  }

  return (
    <div className="page-container">
      <h2>My Tutoring Sessions</h2>

      {error && <div className="error-message">{error}</div>}

      <h3>Upcoming Sessions</h3>
      {upcomingSessions.length === 0 ? (
        <div className="empty-state">No upcoming sessions</div>
      ) : (
        <div className="list-container">
          {upcomingSessions.map((session) => (
            <div key={`${session.SlotID}-${session.BookingID || 'open'}`} className="list-item">
              <h4>{session.CourseName}</h4>
              <p><strong>Date:</strong> {new Date(session.Date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {session.StartTime} - {session.EndTime}</p>
              <p><strong>Location:</strong> {session.Location}</p>
              <p><strong>Status:</strong> {session.Status}</p>
              {session.StudentName && (
                <p><strong>Student:</strong> {session.StudentName}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <h3 style={{ marginTop: '40px' }}>Past Sessions</h3>
      {pastSessions.length === 0 ? (
        <div className="empty-state">No past sessions</div>
      ) : (
        <div className="list-container">
          {pastSessions.map((session, index) => (
            <div key={`${session.BookingID || index}`} className="list-item">
              <h4>{session.CourseName}</h4>
              <p><strong>Date:</strong> {new Date(session.Date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {session.StartTime} - {session.EndTime}</p>
              <p><strong>Location:</strong> {session.Location}</p>
              {session.StudentName && (
                <>
                  <p><strong>Student:</strong> {session.StudentName}</p>
                  <p><strong>Attended:</strong> {session.Attended || 'Not marked'}</p>
                </>
              )}
              {session.Rating && (
                <div style={{ marginTop: '10px', background: '#e8f5e9', padding: '10px', borderRadius: '5px' }}>
                  <p><strong>Student Review:</strong> {session.Rating}/5</p>
                  {session.Comment && <p>{session.Comment}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TutorSessions;
