import React from 'react';
import { Link } from 'react-router-dom';
import './Placeholder.css';

const Placeholder = ({ title, description, comingSoon = true }) => {
  return (
    <div className="placeholder-container">
      <div className="placeholder-content">
        <h1>{title}</h1>
        {comingSoon && (
          <div className="coming-soon-badge">Coming Soon</div>
        )}
        <p className="placeholder-description">
          {description || 'This feature is under development and will be available soon.'}
        </p>
        <Link to="/dashboard" className="btn-back">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Placeholder;

