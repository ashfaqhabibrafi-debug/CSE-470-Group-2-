import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <p className="dashboard-subtitle">Manage and monitor the disaster management system</p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Verify Disasters</h3>
          <p>Review and verify disaster reports submitted by citizens.</p>
          <Link to="/disasters/pending" className="card-link">
            Verify Disasters →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Verify Help Requests</h3>
          <p>Review and verify help requests submitted by citizens.</p>
          <Link to="/admin/help-requests" className="card-link">
            Verify Requests →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Manage Users</h3>
          <p>View and manage all system users.</p>
          <Link to="/admin/users" className="card-link">
            Manage Users →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Manage Organizations</h3>
          <p>Add and manage partnered organizations.</p>
          <Link to="/admin/organizations" className="card-link">
            Manage Organizations →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Create Donation Event</h3>
          <p>Launch a new donation campaign for disaster relief.</p>
          <Link to="/donation-events/create" className="card-link">
            Create Event →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Create Announcement</h3>
          <p>Post important announcements and safety guidelines.</p>
          <Link to="/announcements/create" className="card-link">
            Create Announcement →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Analytics & Reports</h3>
          <p>View system statistics and activity reports.</p>
          <Link to="/admin/analytics" className="card-link">
            View Analytics →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>All Disasters</h3>
          <p>View and manage all disaster reports.</p>
          <Link to="/disasters" className="card-link">
            View All →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Help Requests</h3>
          <p>Monitor all help requests in the system.</p>
          <Link to="/help-requests" className="card-link">
            View Requests →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Donation Events</h3>
          <p>View all donation campaigns and their progress.</p>
          <Link to="/donation-events" className="card-link">
            View Events →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Manage Donations</h3>
          <p>Review and manage donation pledges from users.</p>
          <Link to="/admin/donations" className="card-link">
            Manage Donations →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>All Feedbacks</h3>
          <p>View all feedbacks submitted in the system.</p>
          <Link to="/admin/feedback" className="card-link">
            View Feedbacks →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
