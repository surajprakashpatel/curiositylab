import React, { useState, useEffect } from 'react';
import '../styles/tasks.css';
import '../styles/admin.css';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, fetchUserProfile, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') !== 'false');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
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
          fetchTasks();
          fetchUsers();
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

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedTasks = [];
      querySnapshot.forEach((doc) => {
        fetchedTasks.push({ id: doc.id, ...doc.data() });
      });
      
      setTasks(fetchedTasks);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setIsLoading(false);
    }
  };

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

  const renderTasksTable = () => {
    return (
      <div className="admin-table-container">
        <h2>All Tasks</h2>
        {isLoading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">No tasks found</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Project Type</th>
                <th>Due Date</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td className="description-cell">{task.description}</td>
                  <td>
                    <span className={`status-badge ${task.status}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>{task.projectType}</td>
                  <td>{task.lastDate}</td>
                  <td>
                    {Array.isArray(task.assignedTo) ? 
                      task.assignedTo.join(', ') : 
                      (task.assignedTo || 'Unassigned')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  const handleApproveUser = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        accountStatus: 'active'
      });
      
      // Update local state
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, accountStatus: 'active' } : user
      ));
      
      setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      alert('User has been approved successfully!');
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
            <li className={activeTab === 'tasks' ? 'active' : ''} onClick={() => setActiveTab('tasks')}>
              <span className="icon">📋</span> {!sidebarCollapsed && <span>Tasks</span>}
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
              className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks <span className="count-badge">{tasks.length}</span>
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
            {activeTab === 'tasks' ? renderTasksTable() : renderUsersTable()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
