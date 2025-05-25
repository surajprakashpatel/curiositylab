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
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: [],
    cancelled: []
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    // If we have currentUser but userProfile hasn't been fetched yet
    if (currentUser && !userProfile) {
      fetchUserProfile(currentUser.uid);
    }
  }, [currentUser, userProfile, fetchUserProfile]);

  // Get user's name and initials
  const getUserName = () => {
    if (userProfile?.displayName) {
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
      console.log('Fetching tasks...');
      const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedTasks = {
        todo: [],
        inProgress: [],
        completed: [],
        cancelled: []
      };

      console.log('Total tasks fetched:', querySnapshot.size);
      
      querySnapshot.forEach((doc) => {
        const task = { id: doc.id, ...doc.data() };
        console.log('Processing task:', task.id, 'Status:', task.status);
        
        // Check if the status exists and is valid
        if (task.status && fetchedTasks.hasOwnProperty(task.status)) {
          fetchedTasks[task.status].push(task);
        } else {
          console.warn('Task has invalid status:', task.status, 'Task ID:', task.id);
          // Default to todo if status is invalid
          fetchedTasks.todo.push({ ...task, status: 'todo' });
        }
      });

      console.log('Tasks grouped by status:', {
        todo: fetchedTasks.todo.length,
        inProgress: fetchedTasks.inProgress.length,
        completed: fetchedTasks.completed.length,
        cancelled: fetchedTasks.cancelled.length
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

          <div className="board-columns">
            {/* To Do Column */}
            <div className="board-column">
              <div className="column-header">
                <h3>To Do</h3>
                <span className="task-count">{tasks.todo.length}</span>
              </div>
              <div className="task-list">
                {renderTaskList(tasks.todo)}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="board-column">
              <div className="column-header">
                <h3>In Progress</h3>
                <span className="task-count">{tasks.inProgress.length}</span>
              </div>
              <div className="task-list">
                {renderTaskList(tasks.inProgress)}
              </div>
            </div>

            {/* Completed Column */}
            <div className="board-column">
              <div className="column-header">
                <h3>Completed</h3>
                <span className="task-count">{tasks.completed.length}</span>
              </div>
              <div className="task-list">
                {renderTaskList(tasks.completed)}
              </div>
            </div>

            {/* Cancelled Column */}
            <div className="board-column">
              <div className="column-header">
                <h3>Cancelled</h3>
                <span className="task-count">{tasks.cancelled.length}</span>
              </div>
              <div className="task-list">
                {renderTaskList(tasks.cancelled)}
              </div>
            </div>
          </div>
        </div>
      </main>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskAdded={handleTaskAdded}
      />

      <TaskViewModal 
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </div>
  );
};

export default Tasks;