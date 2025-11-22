import React, { useState } from 'react';
import { studentSignin } from '../../services/api';

function StudentSignin({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await studentSignin(formData);
      
      if (result.success) {
        onLogin(result.data, 'student');
      } else {
        setError(result.error || 'Sign in failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <h2>Student Sign In</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn">Sign In</button>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate('welcome')}>
            Back
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentSignin;
