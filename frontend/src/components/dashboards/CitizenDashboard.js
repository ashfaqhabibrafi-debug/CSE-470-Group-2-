import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const CitizenDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Citizen Dashboard</h1>
        <p>Welcome! Here's what you can do to help during disasters.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Report Disaster</h3>
          <p>Report a disaster in your area with details and location.</p>
          <Link to="/disasters/report" className="card-link">
            Report Now →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Request Help</h3>
          <p>Request assistance for food, water, medical, shelter, or rescue.</p>
          <Link to="/help-requests/create" className="card-link">
            Request Help →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>View Disasters</h3>
          <p>See all reported disasters and their current status.</p>
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
          <p>Donate money, clothes, medicine, or other resources.</p>
          <Link to="/donations/create" className="card-link">
            Donate Now →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>My Help Requests</h3>
          <p>View and manage your help requests.</p>
          <Link to="/help-requests/my-requests" className="card-link">
            My Requests →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Messages</h3>
          <p>Communicate with volunteers and coordinators.</p>
          <Link to="/messages" className="card-link">
            Open Messages →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Give Feedback</h3>
          <p>Share your experience about volunteers, donation events, or organizations.</p>
          <Link to="/feedback/create" className="card-link">
            Give Feedback →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;

