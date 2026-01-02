import React, { useState, useEffect, useCallback } from 'react';
import { getDonations, updateDonationStatus } from '../../services/donationApi';
import './ManageDonations.css';

const ManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pledged');

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let query = {};
      if (filter === 'pledged') {
        query.status = 'pledged';
      } else if (filter === 'confirmed') {
        query.status = 'confirmed';
      } else if (filter === 'delivered') {
        query.status = 'delivered';
      } else if (filter === 'cancelled') {
        query.status = 'cancelled';
      }
      // 'all' means no filter
      const response = await getDonations(query);
      setDonations(response.data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
      setError(error.response?.data?.message || 'Failed to fetch donations');
      setDonations([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      await updateDonationStatus(donationId, newStatus);
      fetchDonations(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update donation status');
      console.error('Error updating donation status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pledged':
        return '#f57c00';
      case 'confirmed':
        return '#1976d2';
      case 'delivered':
        return '#388e3c';
      case 'cancelled':
        return '#616161';
      default:
        return '#666';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="manage-donations-container">
        <div className="page-header">
          <h1>Manage Donations</h1>
          <p>Review and manage donation pledges</p>
        </div>
        <div className="loading">Loading donations...</div>
      </div>
    );
  }

  return (
    <div className="manage-donations-container">
      <div className="page-header">
        <h1>Manage Donations</h1>
        <p>Review and manage donation pledges submitted by users</p>
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
          className={`tab ${filter === 'pledged' ? 'active' : ''}`}
          onClick={() => setFilter('pledged')}
        >
          Pledged {filter === 'pledged' && donations.length > 0 && `(${donations.length})`}
        </button>
        <button
          className={`tab ${filter === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed
        </button>
        <button
          className={`tab ${filter === 'delivered' ? 'active' : ''}`}
          onClick={() => setFilter('delivered')}
        >
          Delivered
        </button>
        <button
          className={`tab ${filter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled
        </button>
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
      </div>

      {donations.length === 0 ? (
        <div className="empty-state">
          <p>
            {filter === 'pledged' 
              ? 'No pledged donations to review.' 
              : filter === 'confirmed' 
              ? 'No confirmed donations found.'
              : filter === 'delivered'
              ? 'No delivered donations found.'
              : filter === 'cancelled'
              ? 'No cancelled donations found.'
              : 'No donations found.'}
          </p>
        </div>
      ) : (
        <div className="donations-list">
          {donations.map((donation) => (
            <div key={donation._id} className="donation-card">
              <div className="card-header">
                <div>
                  <h3>
                    {donation.donationType === 'money' 
                      ? formatAmount(donation.amount)
                      : donation.itemDescription || `${donation.donationType} Donation`}
                  </h3>
                  <div className="card-meta">
                    <span className="donation-type">
                      {donation.donationType.charAt(0).toUpperCase() + donation.donationType.slice(1)}
                    </span>
                    {donation.donationType !== 'money' && (
                      <span className="quantity-badge">
                        Quantity: {donation.quantity}
                      </span>
                    )}
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(donation.status) }}
                    >
                      {donation.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {donation.event && (
                <div className="event-info">
                  <strong>Event:</strong> {donation.event.title || 'N/A'}
                </div>
              )}

              <div className="donor-info">
                <strong>Donor:</strong> {donation.donor?.name || 'Unknown'} ({donation.donor?.email || 'N/A'})
              </div>

              {donation.deliveryAddress && (
                <div className="delivery-info">
                  <strong>Delivery Address:</strong> {donation.deliveryAddress}
                </div>
              )}

              {donation.notes && (
                <div className="notes-info">
                  <strong>Notes:</strong> {donation.notes}
                </div>
              )}

              <div className="card-info">
                <span>📅 {new Date(donation.createdAt).toLocaleString()}</span>
              </div>

              <div className="card-actions">
                {donation.status === 'pledged' && (
                  <div className="action-buttons">
                    <button
                      onClick={() => {
                        if (window.confirm('Confirm this donation pledge?')) {
                          handleStatusUpdate(donation._id, 'confirmed');
                        }
                      }}
                      className="btn-confirm"
                    >
                      ✓ Confirm
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Mark this donation as delivered?')) {
                          handleStatusUpdate(donation._id, 'delivered');
                        }
                      }}
                      className="btn-deliver"
                    >
                      📦 Mark Delivered
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Cancel this donation pledge?')) {
                          handleStatusUpdate(donation._id, 'cancelled');
                        }
                      }}
                      className="btn-cancel"
                    >
                      ✗ Cancel
                    </button>
                  </div>
                )}
                {donation.status === 'confirmed' && (
                  <div className="action-buttons">
                    <button
                      onClick={() => {
                        if (window.confirm('Mark this donation as delivered?')) {
                          handleStatusUpdate(donation._id, 'delivered');
                        }
                      }}
                      className="btn-deliver"
                    >
                      📦 Mark Delivered
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Cancel this donation?')) {
                          handleStatusUpdate(donation._id, 'cancelled');
                        }
                      }}
                      className="btn-cancel"
                    >
                      ✗ Cancel
                    </button>
                  </div>
                )}
                {(donation.status === 'delivered' || donation.status === 'cancelled') && (
                  <div className="status-info">
                    Status: {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
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

export default ManageDonations;

