import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDonationEvents } from '../../services/donationApi';
import './DonationEventCards.css';

const DonationEventCards = ({ limit = null }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getDonationEvents({ status: 'active' });
      let activeEvents = response.data || [];
      
      // Sort by most recent first
      activeEvents = activeEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Limit if specified
      if (limit) {
        activeEvents = activeEvents.slice(0, limit);
      }
      
      setEvents(activeEvents);
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateMoneyProgress = (collected, target) => {
    if (!target || target === 0) return 0;
    return Math.min((collected / target) * 100, 100);
  };

  const calculateItemProgress = (collectedItems, targetItems) => {
    if (!targetItems || Object.keys(targetItems).length === 0) return 0;
    
    let totalTarget = 0;
    let totalCollected = 0;
    
    for (const [item, target] of Object.entries(targetItems)) {
      totalTarget += target;
      totalCollected += (collectedItems?.[item] || 0);
    }
    
    if (totalTarget === 0) return 0;
    return Math.min((totalCollected / totalTarget) * 100, 100);
  };

  if (loading) {
    return (
      <div className="donation-events-section">
        <div className="loading">Loading donation events...</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="donation-events-section">
        <div className="section-header">
          <h2>Active Donation Events</h2>
          <Link to="/donation-events" className="view-all-link">
            View All →
          </Link>
        </div>
        <div className="empty-state">
          <p>No active donation events at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-events-section">
      <div className="section-header">
        <h2>Active Donation Events</h2>
        <Link to="/donation-events" className="view-all-link">
          View All →
        </Link>
      </div>
      
      <div className="event-cards-grid">
        {events.map((event) => {
          const moneyProgress = calculateMoneyProgress(event.collectedAmount, event.targetAmount);
          const itemProgress = calculateItemProgress(event.collectedItems, event.targetItems);
          const targetItemsObj = event.targetItems instanceof Map 
            ? Object.fromEntries(event.targetItems) 
            : (event.targetItems || {});
          const hasTargetItems = Object.keys(targetItemsObj).length > 0;

          return (
            <div key={event._id} className="event-card">
              <div className="event-card-header">
                <h3>{event.title}</h3>
                {event.organization && (
                  <span className="org-badge">{event.organization.name}</span>
                )}
              </div>
              
              <p className="event-description">
                {event.description.length > 150 
                  ? `${event.description.substring(0, 150)}...` 
                  : event.description}
              </p>

              {/* Money Progress */}
              {event.targetAmount > 0 && (
                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Money Donations</span>
                    <span className="progress-percentage">{moneyProgress.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${moneyProgress}%` }}
                    ></div>
                  </div>
                  <div className="progress-details">
                    <span className="collected">{formatAmount(event.collectedAmount)}</span>
                    <span className="target">of {formatAmount(event.targetAmount)}</span>
                    <span className="remaining">
                      {formatAmount(Math.max(0, event.targetAmount - event.collectedAmount))} needed
                    </span>
                  </div>
                </div>
              )}

              {/* Items Progress */}
              {hasTargetItems && (
                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Item Donations</span>
                    <span className="progress-percentage">{itemProgress.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar items-progress" 
                      style={{ width: `${itemProgress}%` }}
                    ></div>
                  </div>
                  <div className="progress-items-list">
                    {Object.entries(targetItemsObj).map(([item, target]) => {
                      const collectedObj = event.collectedItems instanceof Map
                        ? Object.fromEntries(event.collectedItems)
                        : (event.collectedItems || {});
                      const collected = collectedObj[item] || 0;
                      const remaining = Math.max(0, target - collected);
                      return (
                        <div key={item} className="item-progress-row">
                          <span className="item-name">{item}</span>
                          <span className="item-counts">
                            {collected} / {target}
                            {remaining > 0 && (
                              <span className="item-remaining"> ({remaining} needed)</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="event-card-footer">
                <Link to={`/donation-events/${event._id}`} className="view-details-link">
                  View Details →
                </Link>
                <Link to="/donations/create" className="donate-link">
                  Donate Now
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonationEventCards;

