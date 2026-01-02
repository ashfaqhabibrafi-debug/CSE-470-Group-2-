import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDisasters } from '../../services/disasterApi';
import './DisasterList.css';

const DisasterList = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
  });

  useEffect(() => {
    fetchDisasters();
  }, [filters]);

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      const response = await getDisasters(filters);
      setDisasters(response.data || []);
    } catch (error) {
      console.error('Error fetching disasters:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
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

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: '#f57c00',
      verified: '#1976d2',
      active: '#d32f2f',
      resolved: '#388e3c',
      rejected: '#616161',
    };
    return (
      <span
        className="status-badge"
        style={{ backgroundColor: statusColors[status] || '#666' }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="disaster-list-container">
        <div className="loading">Loading disasters...</div>
      </div>
    );
  }

  return (
    <div className="disaster-list-container">
      <div className="list-header">
        <h1>Disaster Reports</h1>
        <div className="header-actions">
          <Link to="/disasters/map" className="btn-secondary">
            🗺️ View Map
          </Link>
          <Link to="/disasters/report" className="btn-primary">
            + Report Disaster
          </Link>
        </div>
      </div>

      <div className="filters">
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="flood">Flood</option>
          <option value="earthquake">Earthquake</option>
          <option value="fire">Fire</option>
          <option value="cyclone">Cyclone</option>
          <option value="tsunami">Tsunami</option>
          <option value="drought">Drought</option>
          <option value="landslide">Landslide</option>
          <option value="other">Other</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {disasters.length === 0 ? (
        <div className="empty-state">
          <p>No disasters found.</p>
          <Link to="/disasters/report" className="btn-primary">
            Report First Disaster
          </Link>
        </div>
      ) : (
        <div className="disasters-grid">
          {disasters.map((disaster) => (
            <div key={disaster._id} className="disaster-card">
              <div className="card-header">
                <h3>{disaster.title}</h3>
                {getStatusBadge(disaster.status)}
              </div>
              
              <div className="card-meta">
                <span className="disaster-type">{disaster.type}</span>
                <span
                  className="severity-badge"
                  style={{ color: getSeverityColor(disaster.severity) }}
                >
                  {disaster.severity}
                </span>
              </div>

              <p className="card-description">
                {disaster.description.length > 150
                  ? `${disaster.description.substring(0, 150)}...`
                  : disaster.description}
              </p>

              {disaster.location && (
                <div className="card-location">
                  📍 {disaster.location.address || 
                      disaster.location.city || 
                      `${disaster.location.latitude?.toFixed(4)}, ${disaster.location.longitude?.toFixed(4)}`}
                </div>
              )}

              <div className="card-footer">
                <div className="card-info">
                  {disaster.affectedCount > 0 && (
                    <span>👥 {disaster.affectedCount} affected</span>
                  )}
                  <span>
                    📅 {new Date(disaster.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Link
                  to={`/disasters/${disaster._id}`}
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

export default DisasterList;

