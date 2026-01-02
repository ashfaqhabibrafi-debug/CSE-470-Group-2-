import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDisasters, verifyDisaster } from '../../services/disasterApi';
import './VerifyDisasters.css';

const VerifyDisasters = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchDisasters();
  }, [filter]);

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      let query = {};
      if (filter === 'verified') {
        // Verified disasters are set to 'active' status after verification
        query.status = 'active';
      } else if (filter === 'rejected') {
        query.status = 'rejected';
      } else if (filter === 'pending') {
        query.status = 'pending';
      }
      // 'all' means no filter
      const response = await getDisasters(query);
      setDisasters(response.data || []);
    } catch (error) {
      console.error('Error fetching disasters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (disasterId, action) => {
    try {
      const status = action === 'approve' ? 'verified' : 'rejected';
      await verifyDisaster(disasterId, status);
      
      // Refresh the list
      fetchDisasters();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to verify disaster');
      console.error('Error verifying disaster:', error);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f57c00';
      case 'verified':
      case 'active':
        return '#388e3c';
      case 'rejected':
        return '#d32f2f';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <div className="verify-disasters-container">
        <div className="loading">Loading disasters...</div>
      </div>
    );
  }

  return (
    <div className="verify-disasters-container">
      <div className="page-header">
        <h1>Verify Disaster Reports</h1>
        <p>Review and verify disaster reports submitted by citizens</p>
      </div>

      <div className="filter-tabs">
        <button
          className={`tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending {filter === 'pending' && disasters.length > 0 && `(${disasters.length})`}
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

      {disasters.length === 0 ? (
        <div className="empty-state">
          <p>
            {filter === 'pending' 
              ? 'No pending disasters to verify.' 
              : filter === 'verified' 
              ? 'No verified/active disasters found.'
              : filter === 'rejected'
              ? 'No rejected disasters found.'
              : 'No disasters found.'}
          </p>
        </div>
      ) : (
        <div className="disasters-list">
          {disasters.map((disaster) => (
            <div key={disaster._id} className="disaster-card">
              <div className="card-header">
                <div>
                  <h3>{disaster.title}</h3>
                  <div className="card-meta">
                    <span className="disaster-type">{disaster.type}</span>
                    <span
                      className="severity-badge"
                      style={{ color: getSeverityColor(disaster.severity) }}
                    >
                      {disaster.severity}
                    </span>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(disaster.status) }}
                    >
                      {disaster.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="card-description">{disaster.description}</p>

              {disaster.location && (
                <div className="card-location">
                  📍 {disaster.location.address || 
                      disaster.location.city || 
                      (disaster.location.coordinates && disaster.location.coordinates.length === 2
                        ? `${disaster.location.coordinates[1].toFixed(4)}, ${disaster.location.coordinates[0].toFixed(4)}`
                        : 'Location not specified')}
                </div>
              )}

              {disaster.reportedBy && (
                <div className="card-info">
                  <span>Reported by: {disaster.reportedBy.name}</span>
                  <span>📅 {new Date(disaster.createdAt).toLocaleString()}</span>
                </div>
              )}

              <div className="card-actions">
                <Link to={`/disasters/${disaster._id}`} className="btn-view">
                  View Details
                </Link>
                {disaster.status === 'pending' && (
                  <div className="action-buttons">
                    <button
                      onClick={() => handleVerify(disaster._id, 'approve')}
                      className="btn-approve"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reject this disaster report?')) {
                          handleVerify(disaster._id, 'reject');
                        }
                      }}
                      className="btn-reject"
                    >
                      ✗ Reject
                    </button>
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

export default VerifyDisasters;

