import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDisaster } from '../../services/disasterApi';
import './DisasterForm.css';

const DisasterReportForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'flood',
    severity: 'medium',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      latitude: '',
      longitude: '',
    },
    affectedCount: 0,
  });
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'affectedCount' ? parseInt(value) || 0 : value,
      });
    }
    setError('');
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    // For now, just store file names. In production, upload to server/storage
    setPhotos(files.map(file => file.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.location.latitude || !formData.location.longitude) {
      setError('Please provide location coordinates. Click "Get My Location" or enter manually.');
      return;
    }

    setLoading(true);

    try {
      const disasterData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        severity: formData.severity,
        location: {
          longitude: parseFloat(formData.location.longitude),
          latitude: parseFloat(formData.location.latitude),
          address: formData.location.address,
          city: formData.location.city,
          state: formData.location.state,
          country: formData.location.country,
        },
        photos: photos,
        affectedCount: formData.affectedCount,
      };

      await createDisaster(disasterData);
      navigate('/disasters');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report disaster. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          });
        },
        (error) => {
          setError('Could not get your location. Please enter coordinates manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="disaster-form-container">
      <div className="form-header">
        <h1>Report Disaster</h1>
        <p>Report a disaster in your area to help coordinate emergency response.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="disaster-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label htmlFor="title">Disaster Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Flood in Downtown Area"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Disaster Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="flood">Flood</option>
              <option value="earthquake">Earthquake</option>
              <option value="fire">Fire</option>
              <option value="cyclone">Cyclone</option>
              <option value="tsunami">Tsunami</option>
              <option value="drought">Drought</option>
              <option value="landslide">Landslide</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="severity">Severity Level *</label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Provide detailed description of the disaster..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="affectedCount">Number of People Affected</label>
            <input
              type="number"
              id="affectedCount"
              name="affectedCount"
              value={formData.affectedCount}
              onChange={handleChange}
              min="0"
              placeholder="Estimated number"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Location</h2>
          
          <button type="button" onClick={getCurrentLocation} className="btn-location">
            📍 Get My Current Location
          </button>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="latitude">Latitude *</label>
              <input
                type="number"
                id="latitude"
                name="location.latitude"
                value={formData.location.latitude}
                onChange={handleChange}
                step="any"
                required
                placeholder="e.g., 40.7128"
              />
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Longitude *</label>
              <input
                type="number"
                id="longitude"
                name="location.longitude"
                value={formData.location.longitude}
                onChange={handleChange}
                step="any"
                required
                placeholder="e.g., -74.0060"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              placeholder="Street address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State/Province</label>
              <input
                type="text"
                id="state"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                placeholder="State/Province"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="location.country"
                value={formData.location.country}
                onChange={handleChange}
                placeholder="Country"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Photos (Optional)</h2>
          <div className="form-group">
            <label htmlFor="photos">Upload Photos</label>
            <input
              type="file"
              id="photos"
              name="photos"
              onChange={handlePhotoChange}
              multiple
              accept="image/*"
            />
            <small>You can select multiple photos</small>
            {photos.length > 0 && (
              <div className="photo-preview">
                {photos.map((photo, index) => (
                  <span key={index} className="photo-name">{photo}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Reporting...' : 'Report Disaster'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DisasterReportForm;

