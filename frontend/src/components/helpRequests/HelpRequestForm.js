import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHelpRequest, getHelpRequests } from '../../services/helpRequestApi';
import { getDisasters } from '../../services/disasterApi';
import './HelpRequestForm.css';

const HelpRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    disaster: '',
    requestType: [],
    description: '',
    urgency: 'medium',
    location: {
      address: '',
      latitude: '',
      longitude: '',
    },
  });
  const [disasters, setDisasters] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      // Fetch all disasters and filter for active ones (verified disasters become 'active')
      const response = await getDisasters();
      const activeDisasters = (response.data || []).filter(
        disaster => disaster.status === 'active' || disaster.status === 'verified'
      );
      setDisasters(activeDisasters);
    } catch (error) {
      console.error('Error fetching disasters:', error);
    }
  };

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
        [name]: value,
      });
    }
    setError('');
  };

  const handleRequestTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        requestType: [...formData.requestType, value],
      });
    } else {
      setFormData({
        ...formData,
        requestType: formData.requestType.filter((type) => type !== value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.requestType.length === 0) {
      setError('Please select at least one request type.');
      return;
    }

    if (!formData.disaster) {
      setError('Please select a disaster.');
      return;
    }

    if (!formData.location.latitude || !formData.location.longitude) {
      setError('Please provide location coordinates.');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        disaster: formData.disaster,
        requestType: formData.requestType,
        description: formData.description,
        urgency: formData.urgency,
        location: {
          longitude: parseFloat(formData.location.longitude),
          latitude: parseFloat(formData.location.latitude),
          address: formData.location.address,
        },
      };

      await createHelpRequest(requestData);
      navigate('/help-requests/my-requests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create help request. Please try again.');
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

  const requestTypes = ['food', 'water', 'shelter', 'medical', 'rescue', 'clothing', 'other'];

  return (
    <div className="help-request-form-container">
      <div className="form-header">
        <h1>Request Help</h1>
        <p>Request assistance for food, water, medical, shelter, or rescue.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="help-request-form">
        <div className="form-section">
          <h2>Disaster Information</h2>
          
          <div className="form-group">
            <label htmlFor="disaster">Select Disaster *</label>
            <select
              id="disaster"
              name="disaster"
              value={formData.disaster}
              onChange={handleChange}
              required
            >
              <option value="">Select a disaster...</option>
              {disasters.map((disaster) => (
                <option key={disaster._id} value={disaster._id}>
                  {disaster.title} ({disaster.type})
                </option>
              ))}
            </select>
            {disasters.length === 0 && (
              <small>No active disasters found. Please report a disaster first.</small>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2>Help Needed</h2>
          
          <div className="form-group">
            <label>What type of help do you need? *</label>
            <div className="checkbox-group">
              {requestTypes.map((type) => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={type}
                    checked={formData.requestType.includes(type)}
                    onChange={handleRequestTypeChange}
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="urgency">Urgency Level *</label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
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
              placeholder="Provide details about the help you need..."
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Your Location</h2>
          
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
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Submitting...' : 'Submit Help Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HelpRequestForm;

