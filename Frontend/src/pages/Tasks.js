import React, { useState, useEffect } from 'react';
import '../styles/tasks.css';
import TaskModal from '../components/TaskModal';
import TaskViewModal from '../components/TaskViewModal';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const Tasks = () => {
  const { currentUser, userProfile, fetchUserProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') !== 'false');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: [],
    cancelled: [],
    visible: []
  });
  const [activeTab, setActiveTab] = useState('todo');

  // Set dark mode as default
  useEffect(() => {
    if (localStorage.getItem('darkMode') === null) {
      localStorage.setItem('darkMode', 'true');
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  useEffect(() => {
    // If we have currentUser but userProfile hasn't been fetched yet
    if (currentUser && !userProfile) {
      fetchUserProfile(currentUser.uid);
    }
  }, [currentUser, userProfile, fetchUserProfile]);

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
    return 'User';
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

  const fetchTasks = async () => {
    try {
      if (!currentUser) return;
      
      console.log('Fetching tasks...');
      const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedTasks = {
        todo: [],
        inProgress: [],
        completed: [],
        cancelled: [],
        visible: []
      };

      // Get current user's ID and username
      const userId = currentUser.uid;
      const username = getUserName();
      
      console.log('Current user ID:', userId);
      console.log('Current username:', username);
      console.log('Total tasks fetched:', querySnapshot.size);
      
      querySnapshot.forEach((doc) => {
        const task = { id: doc.id, ...doc.data() };
        console.log('Task:', task.id, 'assignedTo:', task.assignedTo, 'visibility:', task.visibility);
        
        // Check if task has assignedTo and visibility fields
        const assignedTo = task.assignedTo || [];
        const visibility = task.visibility || [];
        
        // Check if the current user is assigned to this task or has visibility
        const isAssigned = Array.isArray(assignedTo) && 
          (assignedTo.includes(userId) || assignedTo.includes(username));
        const isVisible = Array.isArray(visibility) && 
          (visibility.includes(userId) || visibility.includes(username));
        
        console.log('Task:', task.id, 'isAssigned:', isAssigned, 'isVisible:', isVisible);
        
        if (isAssigned) {
          // If the user is assigned to this task, add it to the appropriate status list
          if (task.status && fetchedTasks.hasOwnProperty(task.status)) {
            fetchedTasks[task.status].push(task);
          } else {
            console.warn('Task has invalid status:', task.status, 'Task ID:', task.id);
            // Default to todo if status is invalid
            fetchedTasks.todo.push({ ...task, status: 'todo' });
          }
        } else if (isVisible && !isAssigned) {
          // If the user is only in the visibility list but not assigned
          fetchedTasks.visible.push(task);
        }
      });

      console.log('Tasks grouped by status:', {
        todo: fetchedTasks.todo.length,
        inProgress: fetchedTasks.inProgress.length,
        completed: fetchedTasks.completed.length,
        cancelled: fetchedTasks.cancelled.length,
        visible: fetchedTasks.visible.length
      });

      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks(prev => ({
      ...prev,
      [newTask.status]: Array.isArray(prev[newTask.status]) ? 
        [newTask, ...prev[newTask.status]] : 
        [newTask]
    }));
  };

  const handleTaskClick = async (taskId) => {
    try {
      const taskDoc = await getDoc(doc(db, 'tasks', taskId));
      if (taskDoc.exists()) {
        setSelectedTask({ id: taskDoc.id, ...taskDoc.data() });
        setIsViewModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };

  const renderTaskList = (taskList) => {
    return taskList.map(task => (
      <div 
        key={task.id} 
        className="task-card"
        onClick={() => handleTaskClick(task.id)}
      >
        <h4>{task.title}</h4>
        <p className="task-description">{task.description}</p>
        <div className="task-meta">
          <span className="project-type">{task.projectType}</span>
          <span className="due-date">Due: {task.lastDate}</span>
        </div>
        {task.githubRepo && (
          <a 
            href={task.githubRepo} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="github-link"
            onClick={(e) => e.stopPropagation()}
          >
            📂 GitHub Repository
          </a>
        )}
      </div>
    ));
  };

  return (
    <div className={`erp-container ${darkMode ? 'dark-theme' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h2>{sidebarCollapsed ? 'CL' : 'Curiosity Lab'}</h2>
        </div>
        <nav>
          <ul>
            <li className="active"><span className="icon">📋</span> {!sidebarCollapsed && <span>Tasks</span>}</li>
            <li><span className="icon">📊</span> {!sidebarCollapsed && <span>Dashboard</span>}</li>
            <li><span className="icon">👥</span> {!sidebarCollapsed && <span>Team</span>}</li>
            <li><span className="icon">📁</span> {!sidebarCollapsed && <span>Projects</span>}</li>
            <li><span className="icon">📅</span> {!sidebarCollapsed && <span>Calendar</span>}</li>
            <li><span className="icon">⚙️</span> {!sidebarCollapsed && <span>Settings</span>}</li>
          </ul>
        </nav>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </aside>

      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="search-bar">
            <span className="icon">🔍</span>
            <input type="text" placeholder="Search tasks..." />
          </div>
          <div className="user-menu">
            <button className="theme-toggle" onClick={toggleDarkMode}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="new-task-btn" onClick={() => setIsModalOpen(true)}>+ New Task</button>
            <div className="user-profile">
              <span className="avatar">{getUserInitials()}</span>
              <span className="user-name">{getUserName()}</span>
            </div>
          </div>
        </header>

        {/* Task Board */}
        <div className="task-board">
          <div className="board-header">
            <h1>Tasks Board</h1>
            <div className="board-actions">
              <select className="filter-dropdown">
                <option value="">All Project Types</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="fullstack">Full Stack</option>
                <option value="mobile">Mobile App</option>
                <option value="design">Design</option>
                <option value="documentation">Documentation</option>
                <option value="testing">Testing</option>
                <option value="devops">DevOps</option>
              </select>
            </div>
          </div>

          {/* Task Tabs Navigation */}
          <div className="task-tabs">
            <button 
              className={`tab-btn ${activeTab === 'todo' ? 'active' : ''}`}
              onClick={() => setActiveTab('todo')}
            >
              To Do <span className="task-count-badge">{tasks.todo.length}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'inProgress' ? 'active' : ''}`}
              onClick={() => setActiveTab('inProgress')}
            >
              In Progress <span className="task-count-badge">{tasks.inProgress.length}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed <span className="task-count-badge">{tasks.completed.length}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled <span className="task-count-badge">{tasks.cancelled.length}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'visible' ? 'active' : ''}`}
              onClick={() => setActiveTab('visible')}
            >
              Visible <span className="task-count-badge">{tasks.visible.length}</span>
            </button>
          </div>

          {/* Active Tasks Panel */}
          <div className="task-panel">
            <div className="task-list-container">
              {renderTaskList(tasks[activeTab] || [])}
              {tasks[activeTab]?.length === 0 && (
                <div className="empty-state">
                  <p>No tasks found in this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskAdded={handleTaskAdded}
        currentUser={currentUser}
        userName={getUserName()}
      />

      <TaskViewModal 
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        currentUser={currentUser}
        userName={getUserName()}
      />
    </div>
  );
};

export default Tasks;