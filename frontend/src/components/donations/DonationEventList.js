import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDonationEvents } from '../../services/donationApi';
import './DonationEventList.css';

const DonationEventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getDonationEvents();
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching donation events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getProgress = (collected, target) => {
    if (target === 0) return 0;
    return Math.min((collected / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="donation-events-container">
        <div className="loading">Loading donation events...</div>
      </div>
    );
  }

  return (
    <div className="donation-events-container">
      <div className="list-header">
        <h1>Donation Events</h1>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>No donation events found.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="card-header">
                <h3>{event.title}</h3>
                <span className={`status-badge ${event.status}`}>
                  {event.status.toUpperCase()}
                </span>
              </div>

              <p className="card-description">{event.description}</p>

              {event.organization && (
                <div className="organization-info">
                  <span className="org-label">Organization:</span>
                  <span>{event.organization.name}</span>
                </div>
              )}

              {event.targetAmount > 0 && (
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span className="progress-amount">
                      {formatAmount(event.collectedAmount)} / {formatAmount(event.targetAmount)}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${getProgress(event.collectedAmount, event.targetAmount)}%`,
                      }}
                    />
                  </div>
                  <div className="progress-percentage">
                    {getProgress(event.collectedAmount, event.targetAmount).toFixed(1)}%
                  </div>
                </div>
              )}

              <div className="card-footer">
                {event.endDate && (
                  <span>
                    Ends: {new Date(event.endDate).toLocaleDateString()}
                  </span>
                )}
                <Link
                  to={`/donation-events/${event._id}`}
                  className="btn-view"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationEventList;

