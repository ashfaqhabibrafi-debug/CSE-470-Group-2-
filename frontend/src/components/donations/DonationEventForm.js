import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDonationEvent, getDonationEvents } from '../../services/donationApi';
import { getOrganizations } from '../../services/donationApi';
import './DonationEventForm.css';

const DonationEventForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: 0,
    targetItems: {},
    organization: '',
    endDate: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
    },
  });
  const [organizations, setOrganizations] = useState([]);
  const [targetItemName, setTargetItemName] = useState('');
  const [targetItemQuantity, setTargetItemQuantity] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await getOrganizations();
      setOrganizations(response.data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
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
        [name]: name === 'targetAmount' ? (value === '' ? 0 : parseFloat(value) || 0) : value,
      });
    }
    setError('');
  };

  const handleAddTargetItem = () => {
    if (targetItemName && targetItemQuantity > 0) {
      setFormData({
        ...formData,
        targetItems: {
          ...formData.targetItems,
          [targetItemName]: targetItemQuantity,
        },
      });
      setTargetItemName('');
      setTargetItemQuantity(0);
    }
  };

  const handleRemoveTargetItem = (itemName) => {
    const newItems = { ...formData.targetItems };
    delete newItems[itemName];
    setFormData({
      ...formData,
      targetItems: newItems,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        targetAmount: formData.targetAmount || 0,
        targetItems: Object.keys(formData.targetItems).length > 0 ? formData.targetItems : undefined,
        organization: formData.organization || undefined,
        endDate: formData.endDate || undefined,
        location: formData.location.address || formData.location.city ? formData.location : undefined,
      };

      await createDonationEvent(eventData);
      navigate('/donation-events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donation event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-event-form-container">
      <div className="form-header">
        <h1>Create Donation Event</h1>
        <p>Launch a new donation campaign for disaster relief.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="donation-event-form">
        <div className="form-section">
          <h2>Event Information</h2>
          
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Flood Relief Fund 2024"
            />
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
              placeholder="Describe the donation event and its purpose..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="organization">Partner Organization (Optional)</label>
            <select
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
            >
              <option value="">No organization</option>
              {organizations.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date (Optional)</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Donation Targets</h2>
          
          <div className="form-group">
            <label htmlFor="targetAmount">Target Amount ($) (Optional)</label>
            <input
              type="number"
              id="targetAmount"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Target amount in dollars"
            />
          </div>

          <div className="form-group">
            <label>Target Items (Optional)</label>
            <div className="target-items-input">
              <input
                type="text"
                placeholder="Item name (e.g., 'Winter Coats')"
                value={targetItemName}
                onChange={(e) => setTargetItemName(e.target.value)}
                className="item-name-input"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={targetItemQuantity}
                onChange={(e) => setTargetItemQuantity(parseInt(e.target.value) || 0)}
                min="1"
                className="item-quantity-input"
              />
              <button type="button" onClick={handleAddTargetItem} className="btn-add-item">
                Add
              </button>
            </div>
            {Object.keys(formData.targetItems).length > 0 && (
              <div className="target-items-list">
                {Object.entries(formData.targetItems).map(([item, quantity]) => (
                  <div key={item} className="target-item-tag">
                    <span>{item}: {quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTargetItem(item)}
                      className="btn-remove-item"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2>Location (Optional)</h2>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
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

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationEventForm;

