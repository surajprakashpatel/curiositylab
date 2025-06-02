import React, { useState, useEffect } from 'react';
import '../styles/tasks.css';
import '../styles/client.css';
import { db } from '../services/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Client = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') !== 'false');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');

  // Check if user is client
  useEffect(() => {
    const checkUserRole = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      if (!userProfile) {
        return;
      }

      if (userProfile.accountType !== 'client') {
        // Redirect non-client users
        if (userProfile.accountType === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    };

    checkUserRole();
  }, [currentUser, userProfile, navigate]);

  // Fetch client projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUser || !userProfile) return;

      try {
        setIsLoading(true);
        
        // Query projects where client is the current user
        const q = query(
          collection(db, 'projects'),
          where('clientId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const projectsList = [];
        
        querySnapshot.forEach((doc) => {
          projectsList.push({ id: doc.id, ...doc.data() });
        });
        
        setProjects(projectsList);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [currentUser, userProfile]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    const newSidebarState = !sidebarCollapsed;
    setSidebarCollapsed(newSidebarState);
    localStorage.setItem('sidebarCollapsed', newSidebarState);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'completed': return 'blue';
      case 'on-hold': return 'orange';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className={`erp-container fullscreen-page ${darkMode ? 'dark-theme' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className={`app-title ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {sidebarCollapsed ? 'ERP' : 'ERP System'}
          </h2>
          <button className="collapse-btn" onClick={toggleSidebar}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <div className="sidebar-menu">
          <div className="menu-item active">
            <span className="menu-icon">📊</span>
            <span className={`menu-text ${sidebarCollapsed ? 'collapsed' : ''}`}>Dashboard</span>
          </div>
          <div className="menu-item">
            <span className="menu-icon">📁</span>
            <span className={`menu-text ${sidebarCollapsed ? 'collapsed' : ''}`}>Projects</span>
          </div>
          <div className="menu-item">
            <span className="menu-icon">📝</span>
            <span className={`menu-text ${sidebarCollapsed ? 'collapsed' : ''}`}>Requests</span>
          </div>
          <div className="menu-item">
            <span className="menu-icon">💬</span>
            <span className={`menu-text ${sidebarCollapsed ? 'collapsed' : ''}`}>Messages</span>
          </div>
          <div className="menu-item">
            <span className="menu-icon">⚙️</span>
            <span className={`menu-text ${sidebarCollapsed ? 'collapsed' : ''}`}>Settings</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="menu-item" onClick={handleLogout}>
            <span className="menu-icon">🚪</span>
            <span className={`menu-text ${sidebarCollapsed ? 'collapsed' : ''}`}>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-bar">
          <div className="user-welcome">
            <h2>Welcome, {userProfile?.displayName || userProfile?.username || 'Client'}</h2>
            <p>Client Dashboard</p>
          </div>
          <div className="top-bar-actions">
            <button className="icon-btn" onClick={toggleDarkMode}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="user-profile">
              <div className="avatar">
                {userProfile?.displayName?.[0] || userProfile?.username?.[0] || 'C'}
              </div>
            </div>
          </div>
        </div>

        <div className="client-dashboard">
          <div className="dashboard-header">
            <h1>Client Dashboard</h1>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Active Projects</h3>
              <p className="stat-value">{projects.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="stat-card">
              <h3>Completed Projects</h3>
              <p className="stat-value">{projects.filter(p => p.status === 'completed').length}</p>
            </div>
            <div className="stat-card">
              <h3>On Hold</h3>
              <p className="stat-value">{projects.filter(p => p.status === 'on-hold').length}</p>
            </div>
            <div className="stat-card">
              <h3>Total Projects</h3>
              <p className="stat-value">{projects.length}</p>
            </div>
          </div>

          <div className="projects-section">
            <h2>Your Projects</h2>
            {isLoading ? (
              <div className="loading">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="empty-state">
                <p>You don't have any projects yet.</p>
              </div>
            ) : (
              <div className="projects-table-container">
                <table className="projects-table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th>Due Date</th>
                      <th>Tasks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => (
                      <tr key={project.id}>
                        <td>{project.name}</td>
                        <td>
                          <span 
                            className="status-badge" 
                            style={{ backgroundColor: getStatusColor(project.status) }}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</td>
                        <td>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</td>
                        <td>{project.taskCount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-timeline">
              {projects.length > 0 ? (
                <div className="timeline-items">
                  {projects.slice(0, 5).map(project => (
                    <div className="timeline-item" key={project.id}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>{project.name} - {project.status}</h4>
                        <p>{project.description || 'No description available'}</p>
                        <small>{project.createdAt ? new Date(project.createdAt).toLocaleString() : 'N/A'}</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No recent activity to display.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;
