import React, { useState, useEffect } from 'react';
import '../styles/tasks.css';
import '../styles/admin.css';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc, where, collectionGroup } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, fetchUserProfile, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') !== 'false');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState({});
  // Removed tasks state
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [userTab, setUserTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Set dark mode as default
  useEffect(() => {
    if (localStorage.getItem('darkMode') === null) {
      localStorage.setItem('darkMode', 'true');
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserProfile(currentUser.uid).then(profile => {
        if (!profile || profile.accountType !== 'admin') {
          // Redirect non-admin users to the tasks page
          navigate('/dashboard');
        } else {
          // Load data for admin
          fetchUsers();
          fetchAllProjects();
        }
      });
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState);
  };

  // Get user's name and initials
  const getUserName = () => {
    if (userProfile?.username) {
      return userProfile.username;
    } else if (userProfile?.displayName) {
      return userProfile.displayName;
    } else if (userProfile?.name) {
      return userProfile.name;
    } else if (currentUser?.displayName) {
      return currentUser.displayName;
    } else if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'Admin';
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Removed fetchTasks function

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      
      const fetchedUsers = [];
      const pendingUsersList = [];
      
      querySnapshot.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() };
        fetchedUsers.push(userData);
        
        // Add to pending users list if status is pending
        if (userData.accountStatus === 'pending') {
          pendingUsersList.push(userData);
        }
      });
      
      setUsers(fetchedUsers);
      setPendingUsers(pendingUsersList);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Removed renderTasksTable function

  const [selectedAccountType, setSelectedAccountType] = useState({});

  const handleAccountTypeChange = (userId, accountType) => {
    setSelectedAccountType(prev => ({
      ...prev,
      [userId]: accountType
    }));
  };

  const handleApproveUser = async (userId) => {
    try {
      // Get the selected account type or default to 'user'
      const accountType = selectedAccountType[userId] || 'user';
      
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        accountStatus: 'active',
        accountType: accountType
      });
      
      // Update local state
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, accountStatus: 'active', accountType: accountType } : user
      ));
      
      setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      alert(`User has been approved successfully as ${accountType}!`);
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user. Please try again.');
    }
  };
  
  const handleRejectUser = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        accountStatus: 'rejected'
      });
      
      // Update local state
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, accountStatus: 'rejected' } : user
      ));
      
      setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      alert('User has been rejected.');
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user. Please try again.');
    }
  };

  const fetchAllProjects = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedProjects = [];
      
      // Process each project
      for (const projectDoc of querySnapshot.docs) {
        const projectData = { id: projectDoc.id, ...projectDoc.data() };
        
        // Fetch tasks for this project
        const tasksQuery = query(collection(db, 'projects', projectDoc.id, 'tasks'));
        const tasksSnapshot = await getDocs(tasksQuery);
        
        const projectTasks = [];
        tasksSnapshot.forEach((taskDoc) => {
          projectTasks.push({ id: taskDoc.id, ...taskDoc.data() });
        });
        
        // Sort tasks: uncompleted first, then completed
        projectTasks.sort((a, b) => {
          if ((a.completed || false) === (b.completed || false)) return 0;
          return (a.completed || false) ? 1 : -1;
        });
        
        // Fetch user details for assigned users and managers
        const assignedUsers = [];
        const managerUsers = [];
        
        // Process assigned users
        if (Array.isArray(projectData.assignedTo)) {
          for (const userId of projectData.assignedTo) {
            try {
              const userDoc = await getDoc(doc(db, 'users', userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                assignedUsers.push({
                  id: userId,
                  name: userData.displayName || userData.username || userData.email || 'Unknown User'
                });
              }
            } catch (error) {
              console.error('Error fetching assigned user:', error);
            }
          }
        }
        
        // Process managers
        if (Array.isArray(projectData.managers)) {
          for (const userId of projectData.managers) {
            try {
              const userDoc = await getDoc(doc(db, 'users', userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                managerUsers.push({
                  id: userId,
                  name: userData.displayName || userData.username || userData.email || 'Unknown User'
                });
              }
            } catch (error) {
              console.error('Error fetching manager user:', error);
            }
          }
        }
        
        // Fetch client name if available
        let clientName = 'No Client';
        if (projectData.clientId) {
          try {
            const clientDoc = await getDoc(doc(db, 'users', projectData.clientId));
            if (clientDoc.exists()) {
              const clientData = clientDoc.data();
              clientName = clientData.displayName || clientData.username || clientData.email || 'Unknown Client';
            }
          } catch (error) {
            console.error('Error fetching client details:', error);
          }
        }
        
        // Add enhanced project data to the list
        fetchedProjects.push({
          ...projectData,
          tasks: projectTasks,
          assignedUsers,
          managerUsers,
          clientName
        });
      }
      
      setProjects(fetchedProjects);
      setIsLoading(false);
      console.log('Fetched projects:', fetchedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setIsLoading(false);
    }
  };
  
  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const renderProjectsTable = () => {
    return (
      <div className="admin-table-container projects-table">
        <h2>All Projects</h2>
        {isLoading ? (
          <div className="loading">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">No projects found</div>
        ) : (
          <div className="projects-list">
            {projects.map(project => (
              <div key={project.id} className="project-card admin-project-card">
                <div 
                  className="project-header" 
                  onClick={() => toggleProjectExpansion(project.id)}
                >
                  <div className="project-title-section">
                    <h3>{project.title}</h3>
                    <span className={`status-badge ${project.status}`}>
                      {project.status === 'todo' ? 'To Do' : 
                       project.status === 'inProgress' ? 'In Progress' : 'Completed'}
                    </span>
                  </div>
                  <div className="project-expand-icon">
                    {expandedProjects[project.id] ? '▼' : '►'}
                  </div>
                </div>
                
                {expandedProjects[project.id] && (
                  <div className="project-details">
                    <div className="project-info">
                      <p><strong>Description:</strong> {project.description}</p>
                      <p><strong>Client:</strong> {project.clientName}</p>
                      <p>
                        <strong>Start Date:</strong> 
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                      </p>
                      {project.dueDate && (
                        <p>
                          <strong>Due Date:</strong> 
                          {new Date(project.dueDate).toLocaleDateString()}
                        </p>
                      )}
                      <div className="project-links">
                        {project.githubRepo && (
                          <a 
                            href={project.githubRepo} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="github-link"
                          >
                            📂 GitHub Repository
                          </a>
                        )}
                        {project.liveLink && (
                          <a 
                            href={project.liveLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="live-link"
                          >
                            🌐 Live Site
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="project-users">
                      <div className="assigned-users">
                        <h4>Assigned Users:</h4>
                        {project.assignedUsers.length > 0 ? (
                          <div className="user-chips">
                            {project.assignedUsers.map(user => (
                              <span key={user.id} className="user-chip">{user.name}</span>
                            ))}
                          </div>
                        ) : (
                          <p>No assigned users</p>
                        )}
                      </div>
                      
                      <div className="project-managers">
                        <h4>Project Managers:</h4>
                        {project.managerUsers.length > 0 ? (
                          <div className="user-chips">
                            {project.managerUsers.map(user => (
                              <span key={user.id} className="manager-chip">{user.name}</span>
                            ))}
                          </div>
                        ) : (
                          <p>No project managers</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="project-tasks">
                      <h4>Tasks:</h4>
                      {project.tasks.length > 0 ? (
                        <ul className="tasks-list">
                          {project.tasks.map(task => (
                            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                              <div className="task-content">
                                <span className="task-status-icon">
                                  {task.completed ? '✓' : '○'}
                                </span>
                                <span className="task-title">{task.title}</span>
                              </div>
                              <div className="task-meta">
                                {task.dueDate && (
                                  <span className="task-due-date">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No tasks for this project</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderUsersTable = () => {
    // Filter users based on the selected tab
    const filteredUsers = userTab === 'pending' 
      ? users.filter(user => user.accountStatus === 'pending')
      : userTab === 'active'
      ? users.filter(user => user.accountStatus === 'active')
      : userTab === 'rejected'
      ? users.filter(user => user.accountStatus === 'rejected' || user.accountStatus === 'inactive')
      : users;
      
    return (
      <div className="admin-table-container">
        <h2>Users Management</h2>
        
        <div className="user-tabs">
          <button 
            className={`tab-btn ${userTab === 'all' ? 'active' : ''}`}
            onClick={() => setUserTab('all')}
          >
            All Users
          </button>
          <button 
            className={`tab-btn ${userTab === 'pending' ? 'active' : ''}`}
            onClick={() => setUserTab('pending')}
          >
            Pending Approval <span className="count-badge">{pendingUsers.length}</span>
          </button>
          <button 
            className={`tab-btn ${userTab === 'active' ? 'active' : ''}`}
            onClick={() => setUserTab('active')}
          >
            Active Users
          </button>
          <button 
            className={`tab-btn ${userTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setUserTab('rejected')}
          >
            Rejected/Inactive
          </button>
        </div>
        
        {isLoading ? (
          <div className="loading">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">No users found in this category</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Account Type</th>
                <th>Account Status</th>
                <th>Created At</th>
                {userTab === 'pending' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.displayName || user.username || 'N/A'}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>
                    <span className={`account-type-badge ${user.accountType || 'user'}`}>
                      {user.accountType || 'user'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.accountStatus || 'active'}`}>
                      {user.accountStatus || 'active'}
                    </span>
                  </td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                  {userTab === 'pending' && (
                    <td className="action-buttons">
                      <div className="account-type-selector">
                        <select 
                          value={selectedAccountType[user.id] || 'user'}
                          onChange={(e) => handleAccountTypeChange(user.id, e.target.value)}
                          className="account-type-select"
                        >
                          <option value="user">User</option>
                          <option value="client">Client</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <button 
                        className="approve-btn"
                        onClick={() => handleApproveUser(user.id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleRejectUser(user.id)}
                      >
                        Reject
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className={`erp-container fullscreen-page ${darkMode ? 'dark-theme' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h2>{sidebarCollapsed ? 'CL' : 'Curiosity Lab'}</h2>
        </div>
        <nav>
          <ul>
            <li className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>
              <span className="icon">📁</span> {!sidebarCollapsed && <span>Projects</span>}
            </li>
            <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
              <span className="icon">👥</span> {!sidebarCollapsed && <span>Users</span>}
            </li>
            <li onClick={() => navigate('/dashboard')}>
              <span className="icon">🔄</span> {!sidebarCollapsed && <span>Switch to Tasks</span>}
            </li>
            <li onClick={handleLogout}>
              <span className="icon">🚪</span> {!sidebarCollapsed && <span>Logout</span>}
            </li>
          </ul>
        </nav>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </aside>

      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="admin-title">
            <h1>Admin Dashboard</h1>
          </div>
          <div className="user-menu">
            <button className="theme-toggle" onClick={toggleDarkMode}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="user-profile">
              <span className="avatar">{getUserInitials()}</span>
              <span className="user-name">{getUserName()}</span>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <div className="admin-content">
          <div className="admin-tabs">
            <button 
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects <span className="count-badge">{projects.length}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users <span className="count-badge">{users.length}</span>
              {pendingUsers.length > 0 && (
                <span className="pending-badge">{pendingUsers.length} pending</span>
              )}
            </button>
          </div>

          <div className="admin-panel">
            {activeTab === 'projects' ? renderProjectsTable() : renderUsersTable()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
