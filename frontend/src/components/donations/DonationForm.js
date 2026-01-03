import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDonation, getDonationEvents } from '../../services/donationApi';
import './DonationForm.css';

const DonationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    donationType: 'money',
    amount: '',
    itemDescription: '',
    quantity: '',
    event: '',
    deliveryAddress: '',
    notes: '',
  });
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getDonationEvents();
      // Filter active events on frontend if needed
      const activeEvents = (response.data || []).filter(event => event.status === 'active');
      setEvents(activeEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' || name === 'quantity' 
        ? value  // Keep as string to allow empty value while typing
        : value,
    });
    setError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // Convert to number on blur, but allow empty for amount (will validate on submit)
    if (name === 'amount' || name === 'quantity') {
      const numValue = value === '' ? '' : parseFloat(value) || '';
      setFormData({
        ...formData,
        [name]: numValue,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Convert string values to numbers for submission
    const amount = formData.donationType === 'money' 
      ? (formData.amount === '' ? 0 : parseFloat(formData.amount) || 0)
      : 0;
    const quantity = formData.donationType !== 'money'
      ? (formData.quantity === '' ? 1 : parseInt(formData.quantity, 10) || 1)
      : 1;

    if (formData.donationType === 'money' && amount <= 0) {
      setError('Please enter a valid donation amount.');
      return;
    }

    if (formData.donationType !== 'money' && !formData.itemDescription.trim()) {
      setError('Please describe the items you are donating.');
      return;
    }

    setLoading(true);

    try {
      const donationData = {
        donationType: formData.donationType,
        amount,
        itemDescription: formData.donationType !== 'money' ? formData.itemDescription : '',
        quantity,
        event: formData.event || undefined,
        deliveryAddress: formData.deliveryAddress || undefined,
        notes: formData.notes || undefined,
      };

      await createDonation(donationData);
      navigate('/donations/history');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-form-container">
      <div className="form-header">
        <h1>Make a Donation</h1>
        <p>Your contribution helps those affected by disasters.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-section">
          <h2>Donation Type</h2>
          
          <div className="form-group">
            <label htmlFor="donationType">What would you like to donate? *</label>
            <select
              id="donationType"
              name="donationType"
              value={formData.donationType}
              onChange={handleChange}
              required
            >
              <option value="money">Money</option>
              <option value="clothes">Clothes</option>
              <option value="medicine">Medicine</option>
              <option value="food">Food</option>
              <option value="other">Other</option>
            </select>
          </div>

          {formData.donationType === 'money' ? (
            <div className="form-group">
              <label htmlFor="amount">Donation Amount ($) *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                min="0"
                step="0.01"
                required
                placeholder="Enter amount"
              />
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="itemDescription">Item Description *</label>
                <textarea
                  id="itemDescription"
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe the items you are donating (e.g., 'Winter coats, size M-L', 'Basic medical supplies')"
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                min="1"
                placeholder="Number of items"
              />
              </div>
            </>
          )}
        </div>

        <div className="form-section">
          <h2>Donation Event (Optional)</h2>
          
          <div className="form-group">
            <label htmlFor="event">Select Donation Event</label>
            <select
              id="event"
              name="event"
              value={formData.event}
              onChange={handleChange}
            >
              <option value="">No specific event (General donation)</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title}
                </option>
              ))}
            </select>
            <small>You can donate to a specific campaign or make a general donation</small>
          </div>
        </div>

        <div className="form-section">
          <h2>Delivery Information (Optional)</h2>
          
          <div className="form-group">
            <label htmlFor="deliveryAddress">Delivery Address</label>
            <textarea
              id="deliveryAddress"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              rows="3"
              placeholder="Where should the donation be delivered? (Leave empty if you will deliver personally)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any additional information or special instructions..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Submitting...' : 'Submit Donation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;

