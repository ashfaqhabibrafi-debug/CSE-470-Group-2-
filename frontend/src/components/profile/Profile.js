import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getUser, updateUser } from '../../services/userApi';
import { getCurrentUser } from '../../services/authApi';
import './Profile.css';

const Profile = () => {
  const { user: currentUser, token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      if (currentUser?._id) {
        const response = await getUser(currentUser._id);
        const userData = response.data;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
          },
          skills: userData.skills || [],
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    setError('');
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateUser(user._id, formData);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      fetchUserProfile(); // Refresh profile data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setError('');
    setSuccess('');
    // Reset form to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
        skills: user.skills || [],
      });
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-state">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-edit">
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-content">
        {editing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street || ''}
                  onChange={handleChange}
                  placeholder="Street"
                />
                <div className="address-row">
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city || ''}
                    onChange={handleChange}
                    placeholder="City"
                  />
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state || ''}
                    onChange={handleChange}
                    placeholder="State/Province"
                  />
                </div>
                <div className="address-row">
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode || ''}
                    onChange={handleChange}
                    placeholder="Zip/Postal Code"
                  />
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country || ''}
                    onChange={handleChange}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {(user.role === 'volunteer' || user.role === 'admin') && (
              <div className="form-section">
                <h2>Skills</h2>
                
                <div className="form-group">
                  <label htmlFor="newSkill">Add Skill</label>
                  <div className="skill-input-group">
                    <input
                      type="text"
                      id="newSkill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="e.g., First Aid, Construction, Translation"
                    />
                    <button type="button" onClick={handleAddSkill} className="btn-add-skill">
                      Add
                    </button>
                  </div>
                </div>

                {formData.skills.length > 0 && (
                  <div className="skills-list">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="skill-tag">
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="btn-remove-skill"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-view">
            <div className="profile-section">
              <h2>Basic Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{user.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Role:</span>
                  <span className={`role-badge role-${user.role}`}>{user.role}</span>
                </div>
                {user.phone && (
                  <div className="info-item">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{user.phone}</span>
                  </div>
                )}
                {user.address && (user.address.street || user.address.city) && (
                  <div className="info-item full-width">
                    <span className="info-label">Address:</span>
                    <span className="info-value">
                      {[
                        user.address.street,
                        user.address.city,
                        user.address.state,
                        user.address.zipCode,
                        user.address.country,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {(user.role === 'volunteer' || user.role === 'admin') && (
              <div className="profile-section">
                <h2>Skills</h2>
                {user.skills && user.skills.length > 0 ? (
                  <div className="skills-display">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="skill-badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="no-skills">No skills added yet. Click "Edit Profile" to add skills.</p>
                )}
              </div>
            )}

            <div className="profile-section">
              <h2>Account Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Member Since:</span>
                  <span className="info-value">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

