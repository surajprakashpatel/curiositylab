import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';
import { db } from '../services/firebase';
import { collection, getDocs, query, where, orderBy, doc, getDoc, addDoc, serverTimestamp, onSnapshot, updateDoc } from 'firebase/firestore';

const Dashboard = () => {
  const { currentUser, userProfile, fetchUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') !== 'false');
  
  // Messages state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Fetch user profile
    fetchUserProfile(currentUser.uid);
    
    // Set dark mode as default
    if (localStorage.getItem('darkMode') === null) {
      localStorage.setItem('darkMode', 'true');
      setDarkMode(true);
    }
  }, [currentUser, navigate, fetchUserProfile]);
  
  // Fetch conversations and admin users
  useEffect(() => {
    if (!currentUser) return;
    
    // Fetch admin users for messaging
    const fetchAdmins = async () => {
      try {
        setIsLoading(true);
        const q = query(collection(db, 'users'), where('accountType', '==', 'admin'));
        const querySnapshot = await getDocs(q);
        
        const adminsList = [];
        querySnapshot.forEach((doc) => {
          adminsList.push({ id: doc.id, ...doc.data() });
        });
        
        setAdmins(adminsList);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setIsLoading(false);
      }
    };
    
    // Fetch conversations
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
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
    
    fetchAdmins();
    fetchConversations();
  }, [currentUser]);
  
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };
  
  // Message functions
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;
    
    try {
      // Update the conversation's updatedAt timestamp
      await updateDoc(doc(db, 'conversations', selectedConversation), {
        updatedAt: serverTimestamp()
      });
      
      // Add the message to the conversation
      await addDoc(collection(db, 'conversations', selectedConversation, 'messages'), {
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
  
  const handleStartNewConversation = async (adminId) => {
    if (!adminId || !currentUser) return;
    
    try {
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => 
        conv.participants.includes(adminId)
      );
      
      if (existingConversation) {
        setSelectedConversation(existingConversation.id);
      } else {
        // Create a new conversation
        const conversationRef = await addDoc(collection(db, 'conversations'), {
          participants: [currentUser.uid, adminId],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        setSelectedConversation(conversationRef.id);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
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
  
  // Render messages tab
  const renderMessagesTab = () => {
    return (
      <div className="messages-container">
        <h2>Messages</h2>
        <div className="messaging-interface">
          <div className="conversations-list">
            <div className="conversations-header">
              <h3>Conversations</h3>
              <div className="new-message-dropdown">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) handleStartNewConversation(e.target.value);
                    e.target.value = "";
                  }}
                  className="recipient-select"
                >
                  <option value="">New Message</option>
                  {admins.map(admin => (
                    <option key={admin.id} value={admin.id}>
                      {admin.displayName || admin.username || admin.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="conversation-items">
              {isLoading ? (
                <div className="loading">Loading conversations...</div>
              ) : conversations.length === 0 ? (
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
            {selectedConversation ? (
              <>
                <div className="message-header">
                  <h3>
                    {conversations.find(c => c.id === selectedConversation)?.otherUser?.name || 'Unknown User'}
                  </h3>
                  <span className="user-type">
                    ({conversations.find(c => c.id === selectedConversation)?.otherUser?.accountType || 'user'})
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

  // If no user is logged in, don't render the dashboard
  if (!currentUser) return null;

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-theme' : ''}`}>
      <header className="dashboard-header">
        <div className="logo">
          <h1>Curiosity Lab ERP</h1>
        </div>
        <div className="user-info">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <span className="user-email">{currentUser.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-sidebar">
        <nav className="sidebar-nav">
          <ul>
            <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <a href="#dashboard">Dashboard</a>
            </li>
            <li className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
              <a href="#projects">Projects</a>
            </li>
            <li className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
              <a href="#tasks">Tasks</a>
            </li>
            <li className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
              <a href="#messages">
                Messages
                {getTotalUnreadCount() > 0 && (
                  <span className="unread-badge sidebar-badge">{getTotalUnreadCount()}</span>
                )}
              </a>
            </li>
            <li className={`nav-item ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
              <a href="#team">Team</a>
            </li>
            <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <a href="#settings">Settings</a>
            </li>
          </ul>
        </nav>
      </div>

      <main className="dashboard-main">
        {activeTab === 'dashboard' && (
          <>
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
          </>
        )}
        
        {activeTab === 'messages' && renderMessagesTab()}
      </main>
    </div>
  );
};

export default Dashboard; 