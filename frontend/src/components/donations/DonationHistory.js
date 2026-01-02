import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getDonations } from '../../services/donationApi';
import './DonationHistory.css';

const DonationHistory = () => {
  const { user } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await getDonations();
      setDonations(response.data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#388e3c';
      case 'pending':
        return '#f57c00';
      case 'received':
        return '#1976d2';
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
      <div className="donation-history-container">
        <div className="loading">Loading donation history...</div>
      </div>
    );
  }

  return (
    <div className="donation-history-container">
      <div className="list-header">
        <h1>Donation History</h1>
        <Link to="/donations/create" className="btn-primary">
          + Make Donation
        </Link>
      </div>

      {donations.length === 0 ? (
        <div className="empty-state">
          <p>No donations found.</p>
          <Link to="/donations/create" className="btn-primary">
            Make Your First Donation
          </Link>
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
                      : donation.itemDescription}
                  </h3>
                  <span className="donation-type capitalize">
                    {donation.donationType}
                  </span>
                </div>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(donation.status) }}
                >
                  {donation.status.toUpperCase()}
                </span>
              </div>

              {donation.donationType !== 'money' && (
                <div className="donation-meta">
                  <span>Quantity: {donation.quantity}</span>
                </div>
              )}

              {donation.event && (
                <div className="event-info">
                  <span className="event-label">Event:</span>
                  <span>{donation.event.title}</span>
                </div>
              )}

              {donation.notes && (
                <p className="notes">{donation.notes}</p>
              )}

              <div className="card-footer">
                <span>
                  📅 {new Date(donation.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationHistory;

