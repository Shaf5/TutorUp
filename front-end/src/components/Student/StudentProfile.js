import React, { useState, useEffect } from 'react';
import { getStudentProfile, updateStudentPassword, deleteStudentAccount } from '../../services/api';

function StudentProfile({ studentId, onNavigate, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile for studentId:', studentId);
      const result = await getStudentProfile(studentId);
      console.log('Profile result:', result);
      
      if (result.success) {
        setProfile(result.data);
      } else {
        setError(result.error || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const result = await updateStudentPassword(studentId, passwordData);

      if (result.success) {
        setSuccess('Password updated successfully');
        setPasswordData({ currentPassword: '', newPassword: '' });
        setShowPasswordForm(false);
      } else {
        setError(result.error || 'Failed to update password');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    setError('');
    setSuccess('');

    try {
      const result = await deleteStudentAccount(studentId, deletePassword);

      if (result.success) {
        alert('Account deleted successfully');
        onLogout();
      } else {
        setError(result.error || 'Failed to delete account');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="page-container">
      <h2>My Profile</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {profile && (
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Profile Information</h3>
            <p className="profile-info"><strong>Name:</strong> {profile.name}</p>
            <p className="profile-info"><strong>Email:</strong> {profile.email}</p>
            <p className="profile-info"><strong>Member Since:</strong> {profile.DateJoined ? new Date(profile.DateJoined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
            {profile.joined_year && <p className="profile-info"><strong>Joined Year:</strong> {profile.joined_year}</p>}
          </div>

          {/* Change Password section removed; now only in Settings */}

          {/* Danger Zone (Delete Account) removed; now only in Settings */}
        </div>
      )}
    </div>
  );
}

export default StudentProfile;
