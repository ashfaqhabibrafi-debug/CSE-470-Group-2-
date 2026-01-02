import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyAlerts } from '../../services/alertApi';
import './AlertList.css';

const AlertList = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await getMyAlerts();
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return '#d32f2f';
      case 'high':
        return '#f57c00';
      case 'medium':
        return '#fbc02d';
      case 'low':
        return '#388e3c';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <div className="alerts-container">
        <div className="loading">Loading alerts...</div>
      </div>
    );
  }

  return (
    <div className="alerts-container">
      <div className="list-header">
        <h1>Emergency Alerts & Announcements</h1>
        <p>Important updates and emergency notifications</p>
      </div>

      {alerts.length === 0 ? (
        <div className="empty-state">
          <p>No alerts or announcements at this time.</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div key={alert._id} className={`alert-card priority-${alert.priority || 'medium'}`}>
              <div className="alert-header">
                <h3>{alert.title}</h3>
                <div className="alert-badges">
                  {alert.type && (
                    <span className="type-badge">{alert.type.toUpperCase()}</span>
                  )}
                  {alert.priority && (
                    <span
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(alert.priority) }}
                    >
                      {alert.priority.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <p className="alert-message">{alert.message}</p>

              {alert.disaster && (
                <div className="alert-disaster-link">
                  <Link to={`/disasters/${alert.disaster._id || alert.disaster}`}>
                    View Related Disaster →
                  </Link>
                </div>
              )}

              <div className="alert-footer">
                <span>
                  📅 {new Date(alert.sentAt || alert.createdAt).toLocaleString()}
                </span>
                {alert.sentBy && (
                  <span>By: {alert.sentBy.name}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertList;

