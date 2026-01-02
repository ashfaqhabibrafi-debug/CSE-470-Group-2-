import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboards/Dashboard';
import Placeholder from './components/Placeholder';
import DisasterList from './components/disasters/DisasterList';
import DisasterReportForm from './components/disasters/DisasterReportForm';
import DisasterDetail from './components/disasters/DisasterDetail';
import DisasterMap from './components/disasters/DisasterMap';
import HelpRequestForm from './components/helpRequests/HelpRequestForm';
import HelpRequestList from './components/helpRequests/HelpRequestList';
import HelpRequestDetail from './components/helpRequests/HelpRequestDetail';
import DonationForm from './components/donations/DonationForm';
import DonationHistory from './components/donations/DonationHistory';
import DonationEventList from './components/donations/DonationEventList';
import DonationEventForm from './components/donations/DonationEventForm';
import DonationEventDetail from './components/donations/DonationEventDetail';
import OrganizationList from './components/organizations/OrganizationList';
import FeedbackForm from './components/feedback/FeedbackForm';
import FeedbackList from './components/feedback/FeedbackList';
import AlertList from './components/alerts/AlertList';
import MessageList from './components/messages/MessageList';
import SafetyTips from './components/safety/SafetyTips';
import VerifyDisasters from './components/admin/VerifyDisasters';
import ManageUsers from './components/admin/ManageUsers';
import VerifyHelpRequests from './components/admin/VerifyHelpRequests';
import ManageOrganizations from './components/admin/ManageOrganizations';
import ManageDonations from './components/admin/ManageDonations';
import DonationStats from './components/admin/DonationStats';
import Profile from './components/profile/Profile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Disaster Routes */}
          <Route
            path="/disasters"
            element={
              <ProtectedRoute>
                <Layout>
                  <DisasterList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/disasters/report"
            element={
              <ProtectedRoute>
                <Layout>
                  <DisasterReportForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/disasters/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <DisasterDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/disasters/pending"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <VerifyDisasters />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/disasters/map"
            element={
              <ProtectedRoute>
                <Layout>
                  <DisasterMap />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Help Request Routes */}
          <Route
            path="/help-requests/my-requests"
            element={
              <ProtectedRoute>
                <Layout>
                  <HelpRequestList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/help-requests"
            element={
              <ProtectedRoute>
                <Layout>
                  <HelpRequestList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/help-requests/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <HelpRequestForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/help-requests/nearby"
            element={
              <ProtectedRoute>
                <Layout>
                  <Placeholder title="Nearby Help Requests" description="View help requests near your location. This feature is coming soon!" />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/help-requests/matched"
            element={
              <ProtectedRoute>
                <Layout>
                  <Placeholder title="My Matched Requests" description="View help requests you've committed to helping. This feature is coming soon!" />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/help-requests/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <HelpRequestDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Donation Routes */}
          <Route
            path="/donations"
            element={
              <ProtectedRoute>
                <Layout>
                  <DonationHistory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donations/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <DonationForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donations/history"
            element={
              <ProtectedRoute>
                <Layout>
                  <DonationHistory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donation-events"
            element={
              <ProtectedRoute>
                <Layout>
                  <DonationEventList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donation-events/create"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <DonationEventForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donation-events/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <DonationEventDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Organization Routes */}
          <Route
            path="/organizations"
            element={
              <ProtectedRoute>
                <Layout>
                  <OrganizationList />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Feedback Routes */}
          <Route
            path="/feedback/create"
            element={
              <ProtectedRoute requiredRole="citizen">
                <Layout>
                  <FeedbackForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback/view"
            element={
              <ProtectedRoute>
                <Layout>
                  <FeedbackList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <FeedbackList />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Alert/Announcement Routes */}
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <Layout>
                  <AlertList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <Layout>
                  <AlertList />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Safety Tips Route */}
          <Route
            path="/safety-tips"
            element={
              <ProtectedRoute>
                <Layout>
                  <SafetyTips />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Message Routes */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Layout>
                  <MessageList />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin/help-requests"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <VerifyHelpRequests />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <ManageUsers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/organizations"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <ManageOrganizations />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/donations"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <ManageDonations />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <DonationStats />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Announcement Routes */}
          <Route
            path="/announcements/create"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <Placeholder title="Create Announcement" description="Post important announcements and safety guidelines. This feature is coming soon!" />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
