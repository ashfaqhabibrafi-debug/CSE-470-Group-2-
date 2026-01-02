import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getHelpRequest, verifyHelpRequest } from '../../services/helpRequestApi';
import { AuthContext } from '../../context/AuthContext';
import './HelpRequestDetail.css';

const HelpRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await getHelpRequest(id);
      setRequest(response.data);
    } catch (err) {
      setError('Failed to load help request details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (status) => {
    try {
      await verifyHelpRequest(id, status);
      fetchRequest(); // Refresh the request
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to verify help request');
      console.error('Error verifying help request:', err);
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
      case 'verified':
        return '#388e3c';
      case 'matched':
        return '#1976d2';
      case 'in-progress':
        return '#7b1fa2';
      case 'completed':
        return '#388e3c';
      case 'rejected':
        return '#d32f2f';
      case 'cancelled':
        return '#616161';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <div className="help-request-detail-container">
        <div className="loading">Loading help request details...</div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="help-request-detail-container">
        <div className="error-state">
          <p>{error || 'Help request not found'}</p>
          <Link to="/dashboard" className="btn-back">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="help-request-detail-container">
      <div className="detail-header">
        <Link to="/dashboard" className="btn-back">← Back to Dashboard</Link>
        <h1>Help Request Details</h1>
        {user?.role === 'admin' && request.status === 'pending' && (
          <div className="admin-actions">
            <button
              onClick={() => {
                if (window.confirm('Approve this help request?')) {
                  handleVerify('verified');
                }
              }}
              className="btn-approve"
            >
              ✓ Approve
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reject this help request?')) {
                  handleVerify('rejected');
                }
              }}
              className="btn-reject"
            >
              ✗ Reject
            </button>
          </div>
        )}
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-section">
            <h2>Request Information</h2>
            
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(request.status) }}
                >
                  {request.status.toUpperCase()}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Urgency:</span>
                <span
                  className="urgency-badge"
                  style={{ color: getUrgencyColor(request.urgency) }}
                >
                  {request.urgency.toUpperCase()}
                </span>
              </div>

              {request.verifiedBy && (
                <div className="info-item full-width">
                  <span className="info-label">Verified By:</span>
                  <span className="info-value">{request.verifiedBy.name}</span>
                  <span className="info-value-muted">
                    on {new Date(request.verifiedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="request-types-section">
              <h3>Help Needed</h3>
              <div className="request-types">
                {request.requestType.map((type, index) => (
                  <span key={index} className="type-tag">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="description-section">
              <h3>Description</h3>
              <p>{request.description}</p>
            </div>

            {request.disaster && (
              <div className="disaster-section">
                <h3>Related Disaster</h3>
                <div className="disaster-info">
                  <Link to={`/disasters/${request.disaster._id}`} className="disaster-link">
                    <strong>{request.disaster.title}</strong>
                    <span className="disaster-type">({request.disaster.type})</span>
                  </Link>
                </div>
              </div>
            )}

            {request.location && (
              <div className="location-section">
                <h3>Location</h3>
                <div className="location-info">
                  {request.location.address && (
                    <p><strong>Address:</strong> {request.location.address}</p>
                  )}
                  {request.location.coordinates && request.location.coordinates.length === 2 && (
                    <p>
                      <strong>Coordinates:</strong>{' '}
                      {request.location.coordinates[1].toFixed(6)}, {request.location.coordinates[0].toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {request.matchedVolunteer && (
              <div className="volunteer-section">
                <h3>Matched Volunteer</h3>
                <div className="volunteer-info">
                  <p><strong>Name:</strong> {request.matchedVolunteer.name}</p>
                  {request.matchedVolunteer.email && (
                    <p><strong>Email:</strong> {request.matchedVolunteer.email}</p>
                  )}
                  {request.matchedVolunteer.phone && (
                    <p><strong>Phone:</strong> {request.matchedVolunteer.phone}</p>
                  )}
                  {request.matchedAt && (
                    <p><strong>Matched At:</strong> {new Date(request.matchedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="info-card">
            <h3>Request Details</h3>
            <div className="info-item">
              <span className="info-label">Requested By:</span>
              <span className="info-value">{request.requestedBy?.name || 'N/A'}</span>
            </div>
            {request.requestedBy?.email && (
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{request.requestedBy.email}</span>
              </div>
            )}
            {request.requestedBy?.phone && (
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{request.requestedBy.phone}</span>
              </div>
            )}
            <div className="info-item">
              <span className="info-label">Created:</span>
              <span className="info-value">
                {new Date(request.createdAt).toLocaleString()}
              </span>
            </div>
            {request.updatedAt && (
              <div className="info-item">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">
                  {new Date(request.updatedAt).toLocaleString()}
                </span>
              </div>
            )}
            {request.completedAt && (
              <div className="info-item">
                <span className="info-label">Completed:</span>
                <span className="info-value">
                  {new Date(request.completedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpRequestDetail;

