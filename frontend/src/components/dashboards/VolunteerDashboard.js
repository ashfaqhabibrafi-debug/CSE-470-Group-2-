import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const VolunteerDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Volunteer Dashboard</h1>
        <p>Help those in need. Your assistance makes a difference!</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card highlight">
          <h3>Nearby Help Requests</h3>
          <p>View help requests near your location and offer assistance.</p>
          <Link to="/help-requests/nearby" className="card-link">
            View Nearby Requests →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>My Matched Requests</h3>
          <p>View help requests you've committed to helping.</p>
          <Link to="/help-requests/matched" className="card-link">
            My Matches →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>View Disasters</h3>
          <p>See all reported disasters and their locations.</p>
          <Link to="/disasters" className="card-link">
            View Disasters →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Donation Events</h3>
          <p>View ongoing donation campaigns and see progress.</p>
          <Link to="/donation-events" className="card-link">
            View Events →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Make Donation</h3>
          <p>Donate resources to support relief efforts.</p>
          <Link to="/donations/create" className="card-link">
            Donate Now →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Messages</h3>
          <p>Communicate with citizens seeking help.</p>
          <Link to="/messages" className="card-link">
            Open Messages →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Profile & Skills</h3>
          <p>Update your profile and skills to help matching.</p>
          <Link to="/profile" className="card-link">
            Update Profile →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>My Feedback</h3>
          <p>View feedback from citizens about your assistance.</p>
          <Link to="/feedback/view" className="card-link">
            View Feedback →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;

