import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import CitizenDashboard from './CitizenDashboard';
import VolunteerDashboard from './VolunteerDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Loading...</div>;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'volunteer':
      return <VolunteerDashboard />;
    case 'citizen':
    default:
      return <CitizenDashboard />;
  }
};

export default Dashboard;

