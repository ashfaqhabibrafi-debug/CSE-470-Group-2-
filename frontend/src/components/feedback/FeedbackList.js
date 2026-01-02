import React, { useState, useEffect, useContext } from 'react';
import { getFeedback } from '../../services/feedbackApi';
import { AuthContext } from '../../context/AuthContext';
import './FeedbackList.css';

const FeedbackList = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getFeedback();
      setFeedbacks(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feedbacks.');
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTargetName = (feedback) => {
    if (feedback.targetType === 'volunteer' && feedback.to) {
      return feedback.to.name || 'Unknown Volunteer';
    } else if (feedback.targetType === 'donationEvent' && feedback.donationEvent) {
      return feedback.donationEvent.title || 'Unknown Event';
    } else if (feedback.targetType === 'organization' && feedback.organization) {
      return feedback.organization.name || 'Unknown Organization';
    }
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="feedback-list-container">
        <div className="loading">Loading feedbacks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-list-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="feedback-list-container">
      <div className="list-header">
        <h1>
          {user?.role === 'volunteer' ? 'Feedback About Me' : 'All Feedbacks'}
        </h1>
        <p>
          {user?.role === 'volunteer'
            ? 'See what others are saying about your assistance.'
            : user?.role === 'admin'
            ? 'View all feedbacks submitted in the system.'
            : 'View feedbacks you have submitted.'}
        </p>
      </div>

      {feedbacks.length === 0 ? (
        <div className="empty-state">
          <p>
            {user?.role === 'volunteer'
              ? 'No feedbacks about you yet.'
              : 'No feedbacks found.'}
          </p>
        </div>
      ) : (
        <div className="feedbacks-list">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="feedback-card">
              <div className="feedback-header">
                <div className="feedback-target">
                  <h3>{getTargetName(feedback)}</h3>
                  <span className="target-type-badge">{feedback.targetType}</span>
                </div>
                <div className="feedback-rating">
                  <span className="rating-stars">
                    {'⭐'.repeat(feedback.rating)}
                    {'☆'.repeat(5 - feedback.rating)}
                  </span>
                  <span className="rating-value">{feedback.rating}/5</span>
                </div>
              </div>

              <p className="feedback-comment">{feedback.comment}</p>

              <div className="feedback-footer">
                <div className="feedback-meta">
                  <span className="feedback-from">
                    From: {feedback.from?.name || 'Anonymous'}
                  </span>
                  {feedback.category && (
                    <span className="feedback-category">{feedback.category}</span>
                  )}
                </div>
                <span className="feedback-date">
                  {new Date(feedback.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;

