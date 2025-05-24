import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // If no user is logged in, don't render the dashboard
  if (!currentUser) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <h1>Curiosity Lab ERP</h1>
        </div>
        <div className="user-info">
          <span className="user-email">{currentUser.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-sidebar">
        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active">
              <a href="#dashboard">Dashboard</a>
            </li>
            <li className="nav-item">
              <a href="#projects">Projects</a>
            </li>
            <li className="nav-item">
              <a href="#tasks">Tasks</a>
            </li>
            <li className="nav-item">
              <a href="#team">Team</a>
            </li>
            <li className="nav-item">
              <a href="#reports">Reports</a>
            </li>
            <li className="nav-item">
              <a href="#settings">Settings</a>
            </li>
          </ul>
        </nav>
      </div>

      <main className="dashboard-main">
        <div className="welcome-banner">
          <h2>Welcome to Curiosity Lab ERP System</h2>
          <p>Manage your projects, tasks, and team members efficiently</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Active Projects</h3>
            <div className="stat-value">12</div>
          </div>
          <div className="stat-card">
            <h3>Pending Tasks</h3>
            <div className="stat-value">24</div>
          </div>
          <div className="stat-card">
            <h3>Team Members</h3>
            <div className="stat-value">8</div>
          </div>
          <div className="stat-card">
            <h3>Completed Tasks</h3>
            <div className="stat-value">56</div>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-time">10:45 AM</div>
              <div className="activity-description">New project "Website Redesign" created</div>
            </div>
            <div className="activity-item">
              <div className="activity-time">Yesterday</div>
              <div className="activity-description">Task "Update API Documentation" completed</div>
            </div>
            <div className="activity-item">
              <div className="activity-time">Yesterday</div>
              <div className="activity-description">New team member Jane Doe added</div>
            </div>
            <div className="activity-item">
              <div className="activity-time">2 days ago</div>
              <div className="activity-description">Project "Mobile App" reached 75% completion</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 