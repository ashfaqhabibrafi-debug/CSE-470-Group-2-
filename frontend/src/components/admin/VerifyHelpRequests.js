import React, { useState, useEffect, useCallback } from 'react';
import { getHelpRequests, verifyHelpRequest } from '../../services/helpRequestApi';
import './VerifyHelpRequests.css';

const VerifyHelpRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let query = {};
      if (filter === 'verified') {
        query.status = 'verified';
      } else if (filter === 'rejected') {
        query.status = 'rejected';
      } else if (filter === 'pending') {
        query.status = 'pending';
      }
      // 'all' means no filter
      const response = await getHelpRequests(query);
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching help requests:', error);
      setError(error.response?.data?.message || 'Failed to fetch help requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleVerify = async (requestId, action) => {
    try {
      const status = action === 'approve' ? 'verified' : 'rejected';
      await verifyHelpRequest(requestId, status);
      
      // Refresh the list
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to verify help request');
      console.error('Error verifying help request:', error);
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
      <div className="verify-help-requests-container">
        <div className="page-header">
          <h1>Verify Help Requests</h1>
          <p>Review and verify help requests submitted by citizens</p>
        </div>
        <div className="loading">Loading help requests...</div>
      </div>
    );
  }

  return (
    <div className="verify-help-requests-container">
      <div className="page-header">
        <h1>Verify Help Requests</h1>
        <p>Review and verify help requests submitted by citizens</p>
      </div>

      {error && (
        <div className="error-message" style={{ 
          padding: '1rem', 
          background: '#ffebee', 
          color: '#c62828', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <div className="filter-tabs">
        <button
          className={`tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending {filter === 'pending' && requests.length > 0 && `(${requests.length})`}
        </button>
        <button
          className={`tab ${filter === 'verified' ? 'active' : ''}`}
          onClick={() => setFilter('verified')}
        >
          Verified
        </button>
        <button
          className={`tab ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <p>
            {filter === 'pending' 
              ? 'No pending help requests to verify.' 
              : filter === 'verified' 
              ? 'No verified help requests found.'
              : filter === 'rejected'
              ? 'No rejected help requests found.'
              : 'No help requests found.'}
          </p>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="card-header">
                <div>
                  <h3>
                    {request.disaster?.title || 'Disaster'}
                  </h3>
                  <div className="card-meta">
                    <span className="disaster-type">
                      {request.disaster?.type || 'N/A'}
                    </span>
                    <span
                      className="urgency-badge"
                      style={{ color: getUrgencyColor(request.urgency) }}
                    >
                      ⚠ {request.urgency}
                    </span>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="request-types">
                {request.requestType.map((type, index) => (
                  <span key={index} className="type-tag">
                    {type}
                  </span>
                ))}
              </div>

              <p className="card-description">
                {request.description.length > 200
                  ? `${request.description.substring(0, 200)}...`
                  : request.description}
              </p>

              <div className="card-info">
                {request.requestedBy && (
                  <span>Requested by: {request.requestedBy.name}</span>
                )}
                <span>📅 {new Date(request.createdAt).toLocaleString()}</span>
              </div>

              <div className="card-actions">
                {request.status === 'pending' && (
                  <div className="action-buttons">
                    <button
                      onClick={() => handleVerify(request._id, 'approve')}
                      className="btn-approve"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reject this help request?')) {
                          handleVerify(request._id, 'reject');
                        }
                      }}
                      className="btn-reject"
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
                {request.status !== 'pending' && request.verifiedBy && (
                  <div className="verified-info">
                    Verified by: {request.verifiedBy.name} on {new Date(request.verifiedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyHelpRequests;

