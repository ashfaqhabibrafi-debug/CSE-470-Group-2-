import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { createFeedback } from '../../services/feedbackApi';
import { getVolunteers } from '../../services/userApi';
import { getDonationEvents } from '../../services/donationApi';
import { getOrganizations } from '../../services/organizationApi';
import './FeedbackForm.css';

const FeedbackForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    targetType: 'volunteer',
    targetId: '',
    rating: 5,
    comment: '',
    category: 'overall',
  });
  const [volunteers, setVolunteers] = useState([]);
  const [donationEvents, setDonationEvents] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    fetchOptions();
  }, [formData.targetType]);

  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);
      if (formData.targetType === 'volunteer') {
        const response = await getVolunteers();
        setVolunteers(response.data || []);
      } else if (formData.targetType === 'donationEvent') {
        const response = await getDonationEvents();
        setDonationEvents(response.data || []);
      } else if (formData.targetType === 'organization') {
        const response = await getOrganizations();
        setOrganizations(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching options:', err);
      setError('Failed to load options. Please try again.');
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' || name === 'targetId' ? (name === 'rating' ? parseInt(value) : value) : value,
      // Reset targetId when targetType changes
      ...(name === 'targetType' && { targetId: '' }),
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.targetId) {
      setError('Please select a target for your feedback.');
      return;
    }

    if (!formData.comment) {
      setError('Please provide a comment.');
      return;
    }

    // Only citizens can submit feedback
    if (user?.role !== 'citizen') {
      setError('Only citizens can submit feedback.');
      return;
    }

    setLoading(true);

    try {
      await createFeedback(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTargetName = (target) => {
    if (formData.targetType === 'volunteer') {
      return target.name || target.email || 'Unknown Volunteer';
    } else if (formData.targetType === 'donationEvent') {
      return target.title || 'Unknown Event';
    } else if (formData.targetType === 'organization') {
      return target.name || 'Unknown Organization';
    }
    return 'Unknown';
  };

  return (
    <div className="feedback-form-container">
      <div className="form-header">
        <h1>Leave Feedback</h1>
        <p>Share your experience and help others in the community.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="targetType">Feedback For *</label>
            <select
              id="targetType"
              name="targetType"
              value={formData.targetType}
              onChange={handleChange}
              required
            >
              <option value="volunteer">Volunteer</option>
              <option value="donationEvent">Donation Event</option>
              <option value="organization">Organization</option>
            </select>
            <small>Select the type of feedback you want to provide</small>
          </div>

          <div className="form-group">
            <label htmlFor="targetId">
              {formData.targetType === 'volunteer' ? 'Volunteer' :
               formData.targetType === 'donationEvent' ? 'Donation Event' :
               'Organization'} *
            </label>
            {loadingOptions ? (
              <div className="loading-options">Loading options...</div>
            ) : (
              <select
                id="targetId"
                name="targetId"
                value={formData.targetId}
                onChange={handleChange}
                required
              >
                <option value="">Select {formData.targetType === 'volunteer' ? 'a volunteer' :
                                   formData.targetType === 'donationEvent' ? 'a donation event' :
                                   'an organization'}...</option>
                {formData.targetType === 'volunteer' && volunteers.map((volunteer) => (
                  <option key={volunteer._id} value={volunteer._id}>
                    {volunteer.name} ({volunteer.email})
                  </option>
                ))}
                {formData.targetType === 'donationEvent' && donationEvents.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
                {formData.targetType === 'organization' && organizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="overall">Overall</option>
              {formData.targetType === 'volunteer' && (
                <>
                  <option value="response_time">Response Time</option>
                  <option value="helpfulness">Helpfulness</option>
                  <option value="communication">Communication</option>
                </>
              )}
              {formData.targetType === 'donationEvent' && (
                <>
                  <option value="service">Service Quality</option>
                  <option value="impact">Impact</option>
                </>
              )}
              {formData.targetType === 'organization' && (
                <>
                  <option value="service">Service Quality</option>
                  <option value="impact">Impact</option>
                </>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating *</label>
            <div className="rating-stars-container">
              <div className="star-rating">
                <input
                  type="radio"
                  id="star5"
                  name="rating"
                  value="5"
                  checked={formData.rating === 5}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="star5">★</label>
                <input
                  type="radio"
                  id="star4"
                  name="rating"
                  value="4"
                  checked={formData.rating === 4}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="star4">★</label>
                <input
                  type="radio"
                  id="star3"
                  name="rating"
                  value="3"
                  checked={formData.rating === 3}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="star3">★</label>
                <input
                  type="radio"
                  id="star2"
                  name="rating"
                  value="2"
                  checked={formData.rating === 2}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="star2">★</label>
                <input
                  type="radio"
                  id="star1"
                  name="rating"
                  value="1"
                  checked={formData.rating === 1}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="star1">★</label>
              </div>
              <div className="rating-display">
                <span className="rating-value">{formData.rating}</span>
                <span className="rating-text">out of 5</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Comment *</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Share your experience..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={loading || loadingOptions} className="btn-submit">
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
