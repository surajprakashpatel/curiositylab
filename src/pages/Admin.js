import React, { useState, useEffect } from 'react';
import '../styles/tasks.css';
import '../styles/admin.css';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc, where, collectionGroup, addDoc, serverTimestamp, onSnapshot, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useGithub } from '../contexts/GithubContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, fetchUserProfile, logout } = useAuth();
  const { fetchGithubApi, githubToken } = useGithub();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') !== 'false');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [userTab, setUserTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Messages state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  
  // Activity state
  const [projectCommits, setProjectCommits] = useState({});
  const [allCommits, setAllCommits] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

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
          fetchConversations();
        }
      });
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Fetch commits when projects are loaded and GitHub token is available
  useEffect(() => {
    if (projects.length > 0 && githubToken) {
      fetchAllProjectCommits();
    }
  }, [projects, githubToken]);

  // Listen for new messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversation || !currentUser) return;

    const conversationRef = doc(db, 'conversations', selectedConversation);
    const messagesRef = collection(conversationRef, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = [];
      snapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(fetchedMessages);
      
      // Mark messages as read
      markConversationAsRead(selectedConversation);
    });

    return () => unsubscribe();
  }, [selectedConversation, currentUser]);

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

  const handleDeleteProject = async (projectId) => {
    // Confirm before deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this project? This action cannot be undone.");
    if (!confirmDelete) return;
    
    try {
      setIsLoading(true);
      
      // First delete all tasks associated with the project
      const tasksQuery = query(collection(db, 'projects', projectId, 'tasks'));
      const tasksSnapshot = await getDocs(tasksQuery);
      
      const batch = [];
      tasksSnapshot.forEach((taskDoc) => {
        const taskRef = doc(db, 'projects', projectId, 'tasks', taskDoc.id);
        batch.push(deleteDoc(taskRef));
      });
      
      // Wait for all task deletions to complete
      await Promise.all(batch);
      
      // Now delete the project document
      await deleteDoc(doc(db, 'projects', projectId));
      
      // Update local state
      setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
      
      alert('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Messages functions
  const fetchConversations = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      
      // Get all conversations where the current user is a participant
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', currentUser.uid)
      );
      
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const conversationsList = [];
        const unreadCountsObj = {};
        
        for (const conversationDoc of snapshot.docs) {
          const conversationData = { id: conversationDoc.id, ...conversationDoc.data() };
          
          // Get the other user's ID (not the current user)
          const otherUserId = conversationData.participants.find(id => id !== currentUser.uid);
          
          // Get the other user's details
          try {
            const userDoc = await getDoc(doc(db, 'users', otherUserId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              conversationData.otherUser = {
                id: otherUserId,
                name: userData.displayName || userData.username || userData.email || 'Unknown User',
                accountType: userData.accountType || 'user'
              };
            }
          } catch (error) {
            console.error('Error fetching user details for conversation:', error);
            conversationData.otherUser = { id: otherUserId, name: 'Unknown User' };
          }
          
          // Get the last message
          const messagesRef = collection(conversationDoc.ref, 'messages');
          const lastMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), where('timestamp', '!=', null));
          const lastMessageSnapshot = await getDocs(lastMessageQuery);
          
          if (!lastMessageSnapshot.empty) {
            const lastMessageDoc = lastMessageSnapshot.docs[0];
            const lastMessageData = lastMessageDoc.data();
            conversationData.lastMessage = {
              text: lastMessageData.text,
              timestamp: lastMessageData.timestamp ? lastMessageData.timestamp.toDate() : new Date(),
              senderId: lastMessageData.senderId
            };
            
            // Count unread messages for this conversation
            const unreadQuery = query(
              messagesRef,
              where('read', '==', false),
              where('senderId', '!=', currentUser.uid)
            );
            const unreadSnapshot = await getDocs(unreadQuery);
            unreadCountsObj[conversationDoc.id] = unreadSnapshot.size;
          } else {
            conversationData.lastMessage = null;
          }
          
          conversationsList.push(conversationData);
        }
        
        // Sort conversations by last message timestamp (most recent first)
        conversationsList.sort((a, b) => {
          if (!a.lastMessage) return 1;
          if (!b.lastMessage) return -1;
          return b.lastMessage.timestamp - a.lastMessage.timestamp;
        });
        
        setConversations(conversationsList);
        setUnreadCounts(unreadCountsObj);
        setIsLoading(false);
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || (!selectedRecipient && !selectedConversation) || !currentUser) return;
    
    try {
      // Check if a conversation already exists with this recipient
      let conversationId = selectedConversation;
      
      if (!conversationId) {
        // Create a new conversation
        const conversationRef = await addDoc(collection(db, 'conversations'), {
          participants: [currentUser.uid, selectedRecipient],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        conversationId = conversationRef.id;
        setSelectedConversation(conversationId);
      } else {
        // Update the conversation's updatedAt timestamp
        await updateDoc(doc(db, 'conversations', conversationId), {
          updatedAt: serverTimestamp()
        });
      }
      
      // Add the message to the conversation
      await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
        text: newMessage,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
        read: false
      });
      
      // Clear the input field
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedConversation(conversationId);
    setMessages([]);
  };

  const handleSelectNewRecipient = (userId) => {
    // Check if conversation already exists with this user
    const existingConversation = conversations.find(conv => 
      conv.participants.includes(userId)
    );
    
    if (existingConversation) {
      setSelectedConversation(existingConversation.id);
    } else {
      setSelectedConversation(null);
      setSelectedRecipient(userId);
      setMessages([]);
    }
  };

  const markConversationAsRead = async (conversationId) => {
    if (!conversationId || !currentUser) return;
    
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      const messagesRef = collection(conversationRef, 'messages');
      
      // Get all unread messages not sent by current user
      const unreadQuery = query(
        messagesRef,
        where('read', '==', false),
        where('senderId', '!=', currentUser.uid)
      );
      
      const unreadSnapshot = await getDocs(unreadQuery);
      
      // Update each message to mark as read
      const batch = [];
      unreadSnapshot.forEach((doc) => {
        batch.push(updateDoc(doc.ref, { read: true }));
      });
      
      await Promise.all(batch);
      
      // Update unread counts
      setUnreadCounts(prev => ({
        ...prev,
        [conversationId]: 0
      }));
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  const getTotalUnreadCount = () => {
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
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
                >
                  <div className="project-title-section" onClick={() => toggleProjectExpansion(project.id)}>
                    <h3>{project.title}</h3>
                    <span className={`status-badge ${project.status}`}>
                      {project.status === 'todo' ? 'To Do' : 
                       project.status === 'inProgress' ? 'In Progress' : 'Completed'}
                    </span>
                  </div>
                  <div className="project-actions">
                    <button 
                      className="delete-project-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      title="Delete Project"
                    >
                      🗑️
                    </button>
                    <div 
                      className="project-expand-icon"
                      onClick={() => toggleProjectExpansion(project.id)}
                    >
                      {expandedProjects[project.id] ? '▼' : '►'}
                    </div>
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

  const renderMessagesTab = () => {
    return (
      <div className="admin-table-container messages-container">
        <h2>Messages</h2>
        <div className="messaging-interface">
          <div className="conversations-list">
            <div className="conversations-header">
              <h3>Conversations</h3>
              <div className="new-message-dropdown">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) handleSelectNewRecipient(e.target.value);
                    e.target.value = "";
                  }}
                  className="recipient-select"
                >
                  <option value="">New Message</option>
                  <optgroup label="Clients">
                    {users
                      .filter(user => user.accountType === 'client' && user.accountStatus === 'active')
                      .map(user => (
                        <option key={user.id} value={user.id}>
                          {user.displayName || user.username || user.email}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Users">
                    {users
                      .filter(user => 
                        (user.accountType === 'user' || !user.accountType) && 
                        user.accountStatus === 'active'
                      )
                      .map(user => (
                        <option key={user.id} value={user.id}>
                          {user.displayName || user.username || user.email}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
            </div>
            
            <div className="conversation-items">
              {conversations.length === 0 ? (
                <div className="empty-state">No conversations yet</div>
              ) : (
                conversations.map(conversation => (
                  <div 
                    key={conversation.id} 
                    className={`conversation-item ${selectedConversation === conversation.id ? 'active' : ''}`}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <div className="conversation-avatar">
                      <span className={`user-type-indicator ${conversation.otherUser?.accountType || 'user'}`}>
                        {conversation.otherUser?.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="conversation-details">
                      <div className="conversation-header">
                        <h4>{conversation.otherUser?.name || 'Unknown User'}</h4>
                        {unreadCounts[conversation.id] > 0 && (
                          <span className="unread-badge">{unreadCounts[conversation.id]}</span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <div className="conversation-preview">
                          <p>
                            {conversation.lastMessage.senderId === currentUser.uid ? 'You: ' : ''}
                            {conversation.lastMessage.text.length > 30 
                              ? conversation.lastMessage.text.substring(0, 30) + '...' 
                              : conversation.lastMessage.text}
                          </p>
                          <span className="message-time">
                            {conversation.lastMessage.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="message-content">
            {selectedConversation || selectedRecipient ? (
              <>
                <div className="message-header">
                  <h3>
                    {selectedConversation 
                      ? conversations.find(c => c.id === selectedConversation)?.otherUser?.name || 'Unknown User'
                      : users.find(u => u.id === selectedRecipient)?.displayName || 
                        users.find(u => u.id === selectedRecipient)?.username || 
                        users.find(u => u.id === selectedRecipient)?.email || 
                        'New Message'}
                  </h3>
                  <span className="user-type">
                    {selectedConversation 
                      ? `(${conversations.find(c => c.id === selectedConversation)?.otherUser?.accountType || 'user'})`
                      : `(${users.find(u => u.id === selectedRecipient)?.accountType || 'user'})`}
                  </span>
                </div>
                
                <div className="messages-list">
                  {messages.length === 0 ? (
                    <div className="empty-state">No messages yet</div>
                  ) : (
                    messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`message-bubble ${message.senderId === currentUser.uid ? 'sent' : 'received'}`}
                      >
                        <div className="message-text">{message.text}</div>
                        <div className="message-meta">
                          {message.timestamp ? (
                            <span className="message-time">
                              {message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          ) : (
                            <span className="message-time">Sending...</span>
                          )}
                          {message.senderId === currentUser.uid && (
                            <span className="message-status">
                              {message.read ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="message-input">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="no-conversation-selected">
                <div className="empty-state">
                  <p>Select a conversation or start a new message</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const fetchAllProjectCommits = async () => {
    if (!githubToken) return;
    
    setActivityLoading(true);
    const commits = {};
    const allCommitsArray = [];
    
    try {
      for (const project of projects) {
        if (project.githubRepo) {
          // Extract owner and repo from GitHub URL
          const match = project.githubRepo.match(/github\.com\/([^\/]+)\/([^\/]+)/);
          if (match) {
            const owner = match[1];
            const repo = match[2];
            
            try {
              const response = await fetchGithubApi(`/repos/${owner}/${repo}/commits`);
              
              if (response && Array.isArray(response)) {
                // Add project info to each commit
                const projectCommits = response.map(commit => ({
                  ...commit,
                  projectId: project.id,
                  projectTitle: project.title,
                  repo: repo,
                  owner: owner
                }));
                
                commits[project.id] = projectCommits;
                allCommitsArray.push(...projectCommits);
              }
            } catch (error) {
              console.error(`Error fetching commits for ${project.title}:`, error);
            }
          }
        }
      }
      
      // Sort all commits by date (newest first)
      allCommitsArray.sort((a, b) => {
        const dateA = new Date(a.commit.author.date);
        const dateB = new Date(b.commit.author.date);
        return dateB - dateA;
      });
      
      setProjectCommits(commits);
      setAllCommits(allCommitsArray);
    } catch (error) {
      console.error('Error fetching project commits:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  const renderActivityTab = () => {
    return (
      <div className="admin-table-container">
        <h2>Project Activity</h2>
        <div className="activity-controls">
          <button 
            className="refresh-btn"
            onClick={fetchAllProjectCommits}
            disabled={activityLoading}
          >
            {activityLoading ? 'Refreshing...' : 'Refresh Activity'}
          </button>
        </div>
        
        {activityLoading ? (
          <div className="loading">Loading project activity...</div>
        ) : allCommits.length === 0 ? (
          <div className="empty-state">No commits found. Make sure projects have valid GitHub repositories.</div>
        ) : (
          <div className="commits-container">
            {allCommits.map((commit, index) => (
              <div key={index} className="commit-card">
                <div className="commit-header">
                  <div className="commit-project">
                    <span className="project-badge">{commit.projectTitle}</span>
                    <span className="repo-badge">{commit.owner}/{commit.repo}</span>
                  </div>
                  <div className="commit-date">
                    {new Date(commit.commit.author.date).toLocaleString()}
                  </div>
                </div>
                <div className="commit-message">
                  {commit.commit.message}
                </div>
                <div className="commit-author">
                  {commit.author ? (
                    <div className="author-info">
                      <img 
                        src={commit.author.avatar_url} 
                        alt={commit.author.login}
                        className="author-avatar"
                      />
                      <span className="author-name">{commit.author.login}</span>
                    </div>
                  ) : (
                    <span className="author-name">{commit.commit.author.name}</span>
                  )}
                  <a 
                    href={commit.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="commit-link"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
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
            <li className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
              <span className="icon">💬</span> 
              {!sidebarCollapsed && (
                <span>
                  Messages
                  {getTotalUnreadCount() > 0 && (
                    <span className="unread-badge sidebar-badge">{getTotalUnreadCount()}</span>
                  )}
                </span>
              )}
              {sidebarCollapsed && getTotalUnreadCount() > 0 && (
                <span className="unread-badge sidebar-badge-collapsed">{getTotalUnreadCount()}</span>
              )}
            </li>
            <li className={activeTab === 'activity' ? 'active' : ''} onClick={() => setActiveTab('activity')}>
              <span className="icon">📊</span> {!sidebarCollapsed && <span>Activity</span>}
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
            <button 
              className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              Messages
              {getTotalUnreadCount() > 0 && (
                <span className="pending-badge">{getTotalUnreadCount()} unread</span>
              )}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
          </div>

          <div className="admin-panel">
            {activeTab === 'projects' ? renderProjectsTable() : 
             activeTab === 'users' ? renderUsersTable() : 
             activeTab === 'messages' ? renderMessagesTab() :
             renderActivityTab()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
