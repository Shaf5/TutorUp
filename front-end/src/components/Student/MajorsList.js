
import React, { useState, useEffect } from 'react';
import { getAllMajors } from '../../services/api';
// Map major names or IDs to image filenames
const majorImages = {
  'Biology': 'Biology.jpg',
  'Business': 'Business.jpg',
  'business': 'Business.jpg',
  'Business Administration': 'Business.jpg',
  'Mathematics': 'Mathematics.jpg',
  'mathematics': 'Mathematics.jpg',
  'Mathematics.jpeg': 'Mathematics.jpeg',
  'Chemistry': 'Chemistry.jpeg',
  'Computer Science': 'ComputerScience.jpg',
  'Economics': 'Economics.jpg',
  'English Literature': 'EnglishLiterature.jpg',
  'History': 'History.jpg',
  'Physics': 'Physics.jpg',
  'Psychology': 'Psychology.png',
  'psychology': 'Psychology.png',
  'Psychology.jpeg': 'Psychology.png',
};
const fallbackImage = '/course-images/default.jpg'; // Add a default.jpg image if you want a fallback

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
          {majors.map((major) => {
            console.log('MajorName:', major.MajorName);
            let imgFile = majorImages[major.MajorName]
              || majorImages[major.MajorName?.toLowerCase()]
              || majorImages[major.MajorName?.replace(/\s/g, '')]
              || fallbackImage;
            return (
              <div
                key={major.MajorID}
                className="card"
                onClick={() => handleMajorClick(major)}
              >
                <img
                  src={imgFile.startsWith('/') ? imgFile : `/course-images/${imgFile}`}
                  alt={major.MajorName}
                  style={{
                    width: '100%',
                    maxHeight: '160px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    marginBottom: '12px',
                  }}
                />
                <h3>{major.MajorName}</h3>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MajorsList;
