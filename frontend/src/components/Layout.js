import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {isAuthenticated && (
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/dashboard" className="navbar-brand">
              Disaster Management
            </Link>
            <div className="navbar-menu">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              {user?.role === 'citizen' && (
                <>
                  <Link to="/disasters" className="nav-link">Disasters</Link>
                  <Link to="/help-requests/my-requests" className="nav-link">My Requests</Link>
                </>
              )}
              {user?.role === 'volunteer' && (
                <>
                  <Link to="/help-requests/nearby" className="nav-link">Nearby Requests</Link>
                  <Link to="/help-requests/matched" className="nav-link">My Matches</Link>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <Link to="/disasters/pending" className="nav-link">Verify Disasters</Link>
                  <Link to="/admin/help-requests" className="nav-link">Verify Requests</Link>
                  <Link to="/admin/users" className="nav-link">Users</Link>
                  <Link to="/admin/organizations" className="nav-link">Organizations</Link>
                  <Link to="/admin/donations" className="nav-link">Donations</Link>
                </>
              )}
              <Link to="/donations" className="nav-link">Donations</Link>
              <Link to="/messages" className="nav-link">Messages</Link>
              <div className="nav-user">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;

