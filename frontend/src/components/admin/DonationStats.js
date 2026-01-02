import React, { useState, useEffect } from 'react';
import { getDonationStats } from '../../services/donationApi';
import './DonationStats.css';

const DonationStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDonationStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching donation stats:', error);
      setError(error.response?.data?.message || 'Failed to fetch donation statistics');
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

  const getTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <div className="donation-stats-container">
        <div className="page-header">
          <h1>Donation Statistics</h1>
          <p>Track total donations and items collected</p>
        </div>
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="donation-stats-container">
        <div className="page-header">
          <h1>Donation Statistics</h1>
          <p>Track total donations and items collected</p>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="donation-stats-container">
        <div className="page-header">
          <h1>Donation Statistics</h1>
          <p>Track total donations and items collected</p>
        </div>
        <div className="empty-state">No statistics available</div>
      </div>
    );
  }

  return (
    <div className="donation-stats-container">
      <div className="page-header">
        <h1>Donation Statistics</h1>
        <p>Track total donations and items collected across all donation events</p>
      </div>

      <div className="stats-grid">
        {/* Total Money Card */}
        <div className="stat-card primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Money Donated</h3>
            <p className="stat-value">{formatAmount(stats.totalMoney)}</p>
            <p className="stat-subtitle">From all confirmed and delivered donations</p>
          </div>
        </div>

        {/* Total Donations Card */}
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Donations</h3>
            <p className="stat-value">{stats.totalDonations}</p>
            <p className="stat-subtitle">Confirmed and delivered donations</p>
          </div>
        </div>

        {/* Recent Donations Card */}
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Recent Donations</h3>
            <p className="stat-value">{stats.recentDonations}</p>
            <p className="stat-subtitle">In the last 30 days</p>
          </div>
        </div>
      </div>

      {/* Items by Type */}
      {stats.totalItemsByType && stats.totalItemsByType.length > 0 && (
        <div className="section-card">
          <h2>Total Items Donated by Type</h2>
          <div className="items-grid">
            {stats.totalItemsByType.map((itemType) => (
              <div key={itemType.type} className="item-type-card">
                <h3>{getTypeLabel(itemType.type)}</h3>
                <p className="item-count">{itemType.totalQuantity}</p>
                <p className="item-label">items donated</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Donations by Status */}
      {stats.donationsByStatus && (
        <div className="section-card">
          <h2>Donations by Status</h2>
          <div className="status-grid">
            {Object.entries(stats.donationsByStatus).map(([status, count]) => (
              <div key={status} className="status-card">
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(status) }}
                ></div>
                <div className="status-content">
                  <h3>{getTypeLabel(status)}</h3>
                  <p className="status-count">{count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Donations by Type */}
      {stats.donationsByType && (
        <div className="section-card">
          <h2>Donations by Type</h2>
          <div className="type-grid">
            {Object.entries(stats.donationsByType).map(([type, data]) => (
              <div key={type} className="type-card">
                <h3>{getTypeLabel(type)}</h3>
                <div className="type-stats">
                  <div className="type-stat">
                    <span className="type-label">Count:</span>
                    <span className="type-value">{data.count}</span>
                  </div>
                  {type === 'money' && (
                    <div className="type-stat">
                      <span className="type-label">Total:</span>
                      <span className="type-value">{formatAmount(data.totalAmount)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationStats;

