import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDonationEvent } from '../../services/donationApi';
import './DonationEventDetail.css';

const DonationEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getDonationEvent(id);
      setEvent(response.data);
    } catch (err) {
      setError('Failed to load donation event details.');
      console.error(err);
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
    
    const targetObj = targetItems instanceof Map 
      ? Object.fromEntries(targetItems) 
      : targetItems;
    const collectedObj = collectedItems instanceof Map
      ? Object.fromEntries(collectedItems)
      : (collectedItems || {});
    
    let totalTarget = 0;
    let totalCollected = 0;
    
    for (const [item, target] of Object.entries(targetObj)) {
      totalTarget += target;
      totalCollected += (collectedObj[item] || 0);
    }
    
    if (totalTarget === 0) return 0;
    return Math.min((totalCollected / totalTarget) * 100, 100);
  };

  if (loading) {
    return (
      <div className="donation-event-detail-container">
        <div className="loading">Loading donation event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="donation-event-detail-container">
        <div className="error-state">
          <p>{error || 'Donation event not found'}</p>
          <Link to="/donation-events" className="btn-back">← Back to Events</Link>
        </div>
      </div>
    );
  }

  const moneyProgress = calculateMoneyProgress(event.collectedAmount, event.targetAmount);
  const itemProgress = calculateItemProgress(event.collectedItems, event.targetItems);
  const targetItemsObj = event.targetItems instanceof Map 
    ? Object.fromEntries(event.targetItems) 
    : (event.targetItems || {});
  const hasTargetItems = Object.keys(targetItemsObj).length > 0;

  return (
    <div className="donation-event-detail-container">
      <div className="detail-header">
        <Link to="/donation-events" className="btn-back">← Back to Events</Link>
        <div className="header-content">
          <h1>{event.title}</h1>
          <div className="event-meta">
            {event.organization && (
              <span className="org-badge-large">{event.organization.name}</span>
            )}
            <span className={`status-badge-large ${event.status}`}>
              {event.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="main-section">
          <div className="description-section">
            <h2>Description</h2>
            <p>{event.description}</p>
          </div>

          {/* Money Progress */}
          {event.targetAmount > 0 && (
            <div className="progress-card">
              <h2>Money Donations</h2>
              <div className="progress-header">
                <span className="progress-percentage-large">{moneyProgress.toFixed(1)}%</span>
                <div className="progress-amounts">
                  <span className="collected-large">{formatAmount(event.collectedAmount)}</span>
                  <span className="separator">/</span>
                  <span className="target-large">{formatAmount(event.targetAmount)}</span>
                </div>
              </div>
              <div className="progress-bar-large-container">
                <div 
                  className="progress-bar-large" 
                  style={{ width: `${moneyProgress}%` }}
                ></div>
              </div>
              <div className="progress-info">
                <span className="remaining-large">
                  {formatAmount(Math.max(0, event.targetAmount - event.collectedAmount))} still needed
                </span>
              </div>
            </div>
          )}

          {/* Items Progress */}
          {hasTargetItems && (
            <div className="progress-card">
              <h2>Item Donations</h2>
              <div className="progress-header">
                <span className="progress-percentage-large">{itemProgress.toFixed(1)}%</span>
              </div>
              <div className="progress-bar-large-container">
                <div 
                  className="progress-bar-large items-progress-large" 
                  style={{ width: `${itemProgress}%` }}
                ></div>
              </div>
              <div className="items-detail-list">
                {Object.entries(targetItemsObj).map(([item, target]) => {
                  const collectedObj = event.collectedItems instanceof Map
                    ? Object.fromEntries(event.collectedItems)
                    : (event.collectedItems || {});
                  const collected = collectedObj[item] || 0;
                  const remaining = Math.max(0, target - collected);
                  const itemProgressPercent = target > 0 ? Math.min((collected / target) * 100, 100) : 0;
                  
                  return (
                    <div key={item} className="item-detail-row">
                      <div className="item-info">
                        <span className="item-name-large">{item}</span>
                        <span className="item-counts-large">
                          {collected} / {target}
                        </span>
                      </div>
                      <div className="item-progress-bar-container">
                        <div 
                          className="item-progress-bar"
                          style={{ width: `${itemProgressPercent}%` }}
                        ></div>
                      </div>
                      {remaining > 0 && (
                        <span className="item-remaining-large">{remaining} more needed</span>
                      )}
                      {remaining === 0 && (
                        <span className="item-complete">✓ Complete</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {event.location && (event.location.address || event.location.city) && (
            <div className="info-section">
              <h2>Location</h2>
              <p>
                {event.location.address && `${event.location.address}, `}
                {event.location.city && `${event.location.city}, `}
                {event.location.state && `${event.location.state}, `}
                {event.location.country}
              </p>
            </div>
          )}

          {event.endDate && (
            <div className="info-section">
              <h2>Event Timeline</h2>
              <p>
                <strong>Started:</strong> {new Date(event.startDate || event.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Ends:</strong> {new Date(event.endDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="sidebar-section">
          <div className="action-card">
            <h3>Support This Event</h3>
            <p>Make a donation to help reach the goals!</p>
            <Link to="/donations/create" className="btn-donate-primary">
              Donate Now
            </Link>
          </div>

          {event.createdBy && (
            <div className="info-card">
              <h3>Created By</h3>
              <p>{event.createdBy.name}</p>
              {event.createdBy.email && <p className="email">{event.createdBy.email}</p>}
            </div>
          )}

          {event.organization && (
            <div className="info-card">
              <h3>Organization</h3>
              <p>{event.organization.name}</p>
              {event.organization.description && (
                <p className="org-description">{event.organization.description}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationEventDetail;

