import React, { useState, useEffect } from 'react';
import { getAllOrganizations, createOrganization, updateOrganization, deleteOrganization } from '../../services/organizationApi';
import './ManageOrganizations.css';

const ManageOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    logo: '',
    isVerified: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await getAllOrganizations();
      setOrganizations(response.data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setError('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
    setSuccess('');
  };

  const handleEdit = (org) => {
    setEditingId(org._id);
    setFormData({
      name: org.name || '',
      description: org.description || '',
      email: org.email || '',
      phone: org.phone || '',
      website: org.website || '',
      logo: org.logo || '',
      isVerified: org.isVerified !== undefined ? org.isVerified : true,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      email: '',
      phone: '',
      website: '',
      logo: '',
      isVerified: true,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name) {
      setError('Organization name is required');
      return;
    }

    try {
      if (editingId) {
        await updateOrganization(editingId, formData);
        setSuccess('Organization updated successfully!');
      } else {
        await createOrganization(formData);
        setSuccess('Organization created successfully!');
      }
      
      handleCancel();
      fetchOrganizations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save organization');
      console.error('Error saving organization:', err);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteOrganization(id);
      setSuccess('Organization deleted successfully!');
      fetchOrganizations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete organization');
      console.error('Error deleting organization:', err);
    }
  };

  if (loading) {
    return (
      <div className="manage-organizations-container">
        <div className="loading">Loading organizations...</div>
      </div>
    );
  }

  return (
    <div className="manage-organizations-container">
      <div className="page-header">
        <h1>Manage Organizations</h1>
        <p>Add, edit, and manage partnered organizations</p>
      </div>

      <div className="header-actions">
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add Organization
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-header">
              <h2>{editingId ? 'Edit Organization' : 'Add New Organization'}</h2>
              <button onClick={handleCancel} className="btn-close">×</button>
            </div>

            <form onSubmit={handleSubmit} className="organization-form">
              <div className="form-group">
                <label htmlFor="name">Organization Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Organization name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Organization description..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="organization@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                />
              </div>

              <div className="form-group">
                <label htmlFor="logo">Logo URL</label>
                <input
                  type="url"
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleChange}
                  />
                  <span>Verified (Show on public list)</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingId ? 'Update' : 'Create'} Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {organizations.length === 0 ? (
        <div className="empty-state">
          <p>No organizations found.</p>
        </div>
      ) : (
        <div className="organizations-list">
          {organizations.map((org) => (
            <div key={org._id} className="organization-card">
              {org.logo && (
                <div className="org-logo">
                  <img src={org.logo} alt={org.name} onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
              
              <div className="org-content">
                <div className="org-header">
                  <h3>{org.name}</h3>
                  <span className={`status-badge ${org.isVerified ? 'verified' : 'unverified'}`}>
                    {org.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>

                {org.description && (
                  <p className="org-description">{org.description}</p>
                )}

                <div className="org-details">
                  {org.website && (
                    <div className="org-detail-item">
                      <span className="detail-label">Website:</span>
                      <a href={org.website} target="_blank" rel="noopener noreferrer" className="detail-value">
                        {org.website}
                      </a>
                    </div>
                  )}
                  {org.email && (
                    <div className="org-detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{org.email}</span>
                    </div>
                  )}
                  {org.phone && (
                    <div className="org-detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{org.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="org-actions">
                <button onClick={() => handleEdit(org)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(org._id, org.name)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrganizations;

