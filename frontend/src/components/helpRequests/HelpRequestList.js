import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getHelpRequests } from '../../services/helpRequestApi';
import './HelpRequestList.css';

const HelpRequestList = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
  });

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const query = { ...filters };
      if (user?.role === 'citizen') {
        // For citizens, show only their requests
        // Backend will filter based on user ID from token
      }
      const response = await getHelpRequests(query);
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching help requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f57c00';
      case 'matched':
        return '#1976d2';
      case 'in-progress':
        return '#7b1fa2';
      case 'completed':
        return '#388e3c';
      case 'cancelled':
        return '#616161';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <div className="help-request-list-container">
        <div className="loading">Loading help requests...</div>
      </div>
    );
  }

  return (
    <div className="help-request-list-container">
      <div className="list-header">
        <h1>My Help Requests</h1>
        <Link to="/help-requests/create" className="btn-primary">
          + New Request
        </Link>
      </div>

      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="matched">Matched</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <p>No help requests found.</p>
          <Link to="/help-requests/create" className="btn-primary">
            Create First Request
          </Link>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="card-header">
                <div>
                  <h3>
                    {request.disaster?.title || 'Disaster'}
                  </h3>
                  <span className="disaster-type">
                    {request.disaster?.type || 'N/A'}
                  </span>
                </div>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(request.status) }}
                >
                  {request.status.toUpperCase()}
                </span>
              </div>

              <div className="request-types">
                {request.requestType.map((type, index) => (
                  <span key={index} className="type-tag">
                    {type}
                  </span>
                ))}
              </div>

              <p className="card-description">
                {request.description.length > 150
                  ? `${request.description.substring(0, 150)}...`
                  : request.description}
              </p>

              <div className="card-meta">
                <span
                  className="urgency-badge"
                  style={{ color: getUrgencyColor(request.urgency) }}
                >
                  ⚠ {request.urgency.toUpperCase()}
                </span>
                {request.matchedVolunteer && (
                  <span className="matched-info">
                    ✓ Matched with: {request.matchedVolunteer.name}
                  </span>
                )}
              </div>

              <div className="card-footer">
                <span>
                  📅 {new Date(request.createdAt).toLocaleDateString()}
                </span>
                <Link
                  to={`/help-requests/${request._id}`}
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

export default HelpRequestList;

