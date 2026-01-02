import React, { useState, useEffect } from 'react';
import { getOrganizations } from '../../services/donationApi';
import './OrganizationList.css';

const OrganizationList = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await getOrganizations();
      setOrganizations(response.data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="organizations-container">
        <div className="loading">Loading organizations...</div>
      </div>
    );
  }

  return (
    <div className="organizations-container">
      <div className="list-header">
        <h1>Partnered Organizations</h1>
        <p>Organizations contributing to disaster relief efforts</p>
      </div>

      {organizations.length === 0 ? (
        <div className="empty-state">
          <p>No organizations found.</p>
        </div>
      ) : (
        <div className="organizations-grid">
          {organizations.map((org) => (
            <div key={org._id} className="org-card">
              {org.logo && (
                <div className="org-logo">
                  <img src={org.logo} alt={org.name} />
                </div>
              )}
              <div className="org-content">
                <h3>{org.name}</h3>
                {org.description && (
                  <p className="org-description">{org.description}</p>
                )}
                {org.website && (
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="org-website"
                  >
                    Visit Website →
                  </a>
                )}
                {org.contactEmail && (
                  <p className="org-contact">📧 {org.contactEmail}</p>
                )}
                {org.contactPhone && (
                  <p className="org-contact">📞 {org.contactPhone}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationList;

