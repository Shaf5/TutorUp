import React, { useState, useEffect } from 'react';
import { getAllMajors } from '../../services/api';

function MajorsList({ onNavigate, onSelectMajor }) {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    try {
      const result = await getAllMajors();
      
      if (result.success) {
        setMajors(result.data);
      } else {
        setError(result.error || 'Failed to load majors');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMajorClick = (major) => {
    onSelectMajor(major);
    onNavigate('courses');
  };

  if (loading) {
    return <div className="loading">Loading majors...</div>;
  }

  return (
    <div className="page-container">
      <h2>Browse by Major</h2>
      
      {error && <div className="error-message">{error}</div>}

      {majors.length === 0 ? (
        <div className="empty-state">No majors available</div>
      ) : (
        <div className="card-grid">
          {majors.map((major) => (
            <div
              key={major.MajorID}
              className="card"
              onClick={() => handleMajorClick(major)}
            >
              <h3>{major.MajorName}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MajorsList;
