import React, { useState, useEffect } from 'react';
import '../styles/tasks.css';
import '../styles/projectStyles.css';
import ProjectModal from '../components/ProjectModal';
import ProjectViewModal from '../components/ProjectViewModal';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, fetchUserProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectTasks, setSelectedProjectTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') !== 'false');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  const [projects, setProjects] = useState({
    todo: [],
    inProgress: [],
    completed: []
  });
  const [activeTab, setActiveTab] = useState('todo');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTasksPanel, setShowTasksPanel] = useState(false);

  // Set dark mode as default
  useEffect(() => {
    if (localStorage.getItem('darkMode') === null) {
      localStorage.setItem('darkMode', 'true');
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  useEffect(() => {
    // If we have currentUser but userProfile hasn't been fetched yet
    if (currentUser && !userProfile) {
      fetchUserProfile(currentUser.uid);
    }
  }, [currentUser, userProfile, fetchUserProfile]);

  // Check if user is admin
  useEffect(() => {
    if (userProfile && userProfile.accountType === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [userProfile]);

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

  const fetchProjects = async () => {
    try {
      if (!currentUser) return;
      
      console.log('Fetching projects...');
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedProjects = {
        todo: [],
        inProgress: [],
        completed: []
      };

      // Get current user's ID
      const userId = currentUser.uid;
      
      console.log('Current user ID:', userId);
      console.log('Total projects fetched:', querySnapshot.size);
      
      querySnapshot.forEach((doc) => {
        const project = { id: doc.id, ...doc.data() };
        console.log('Project:', project.id, 'assignedTo:', project.assignedTo, 'clientId:', project.clientId);
        
        // Check if project has assignedTo and managers fields
        const assignedTo = project.assignedTo || [];
        const managers = project.managers || [];
        
        // Check if the current user is assigned to this project, is a manager, or created it
        const isInvolved = 
          (Array.isArray(assignedTo) && assignedTo.includes(userId)) ||
          (Array.isArray(managers) && managers.includes(userId)) ||
          project.createdBy === userId ||
          project.clientId === userId;
        
        console.log('Project:', project.id, 'isInvolved:', isInvolved);
        
        if (isInvolved) {
          // Add project to the appropriate status list
          if (project.status && fetchedProjects.hasOwnProperty(project.status)) {
            fetchedProjects[project.status].push(project);
          } else {
            console.warn('Project has invalid status:', project.status, 'Project ID:', project.id);
            // Default to todo if status is invalid
            fetchedProjects.todo.push({ ...project, status: 'todo' });
          }
        }
      });

      console.log('Projects grouped by status:', {
        todo: fetchedProjects.todo.length,
        inProgress: fetchedProjects.inProgress.length,
        completed: fetchedProjects.completed.length
      });

      setProjects(fetchedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectAdded = (newProject) => {
    setProjects(prev => ({
      ...prev,
      [newProject.status]: Array.isArray(prev[newProject.status]) ? 
        [newProject, ...prev[newProject.status]] : 
        [newProject]
    }));
  };

  const fetchProjectTasks = async (projectId) => {
    try {
      const tasksQuery = query(collection(db, 'projects', projectId, 'tasks'));
      const tasksSnapshot = await getDocs(tasksQuery);
      
      const tasks = [];
      tasksSnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort tasks: uncompleted first, then completed (with strikethrough)
      tasks.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
      
      return tasks;
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      return [];
    }
  };

  const handleProjectClick = async (projectId) => {
    try {
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (projectDoc.exists()) {
        const projectData = { id: projectDoc.id, ...projectDoc.data() };
        setSelectedProject(projectData);
        
        // Fetch client name
        if (projectData.clientId) {
          try {
            const clientDoc = await getDoc(doc(db, 'users', projectData.clientId));
            if (clientDoc.exists()) {
              const clientData = clientDoc.data();
              projectData.clientName = clientData.displayName || clientData.username || clientData.email || 'Unknown Client';
              setSelectedProject({...projectData});
            }
          } catch (error) {
            console.error('Error fetching client details:', error);
          }
        }
        
        // Fetch project tasks
        const tasks = await fetchProjectTasks(projectId);
        setSelectedProjectTasks(tasks);
        
        // Show tasks panel instead of opening modal
        setShowTasksPanel(true);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  // Fetch and update client names for all projects
  useEffect(() => {
    const fetchClientNames = async () => {
      const updatedProjects = { ...projects };
      const clientCache = {};
      
      // Function to fetch client name
      const getClientName = async (clientId) => {
        if (!clientId) return 'No Client';
        
        // Check cache first
        if (clientCache[clientId]) return clientCache[clientId];
        
        try {
          const clientDoc = await getDoc(doc(db, 'users', clientId));
          if (clientDoc.exists()) {
            const clientData = clientDoc.data();
            const name = clientData.displayName || clientData.username || clientData.email || 'Unknown Client';
            clientCache[clientId] = name;
            return name;
          }
          clientCache[clientId] = 'Unknown Client';
          return 'Unknown Client';
        } catch (error) {
          console.error('Error fetching client:', error);
          clientCache[clientId] = 'Unknown Client';
          return 'Unknown Client';
        }
      };
      
      // Process all projects to fetch client names
      for (const status in updatedProjects) {
        for (let i = 0; i < updatedProjects[status].length; i++) {
          const project = updatedProjects[status][i];
          if (project.clientId && !project.clientName) {
            const clientName = await getClientName(project.clientId);
            updatedProjects[status][i] = { ...project, clientName };
          }
        }
      }
      
      setProjects(updatedProjects);
    };
    
    if (projects.todo.length > 0 || projects.inProgress.length > 0 || projects.completed.length > 0) {
      fetchClientNames();
    }
  }, [projects.todo.length, projects.inProgress.length, projects.completed.length]);

  const renderProjectList = (projectList) => {
    return projectList.map(project => {
      const isSelected = selectedProject && selectedProject.id === project.id;
      
      return (
        <div 
          key={project.id} 
          className={`project-card ${isSelected ? 'selected' : ''}`}
          onClick={() => handleProjectClick(project.id)}
        >
          <h4>{project.title}</h4>
          <p className="project-description">{project.description}</p>
          <div className="project-meta">
            <span className="client-badge">Client: {project.clientName || 'No Client'}</span>
            {project.dueDate && <span className="due-date">Due: {new Date(project.dueDate).toLocaleDateString()}</span>}
          </div>
          <div className="project-links">
            {project.githubRepo && (
              <a 
                href={project.githubRepo} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="github-link"
                onClick={(e) => e.stopPropagation()}
              >
                📂 GitHub
              </a>
            )}
            {project.liveLink && (
              <a 
                href={project.liveLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="live-link"
                onClick={(e) => e.stopPropagation()}
              >
                🌐 Live Site
              </a>
            )}
          </div>
        </div>
      );
    });
  };
  
  // Function to toggle task completion status
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    if (!selectedProject) return;
    
    try {
      // Update in Firestore
      const taskRef = doc(db, 'projects', selectedProject.id, 'tasks', taskId);
      await updateDoc(taskRef, {
        completed: !currentStatus
      });
      
      // Update in local state
      setSelectedProjectTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? {...task, completed: !currentStatus} 
            : task
        ).sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        })
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  
  // Function to delete a task
  const deleteTask = async (taskId) => {
    if (!selectedProject) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        // Delete from Firestore
        const taskRef = doc(db, 'projects', selectedProject.id, 'tasks', taskId);
        await deleteDoc(taskRef);
        
        // Remove from local state
        setSelectedProjectTasks(prev => prev.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
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
            <input type="text" placeholder="Search projects..." />
          </div>
          <div className="user-menu">
            <button className="theme-toggle" onClick={toggleDarkMode}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="new-project-btn" onClick={() => setIsModalOpen(true)}>+ New Project</button>
            {isAdmin && (
              <button className="admin-switch-btn" onClick={() => navigate('/admin')}>
                Admin Dashboard
              </button>
            )}
            <div className="user-profile">
              <span className="avatar">{getUserInitials()}</span>
              <span className="user-name">{getUserName()}</span>
            </div>
          </div>
        </header>

        {/* Task Board */}
        <div className="task-board">
          <div className="board-header">
            <h1>Projects Board</h1>
            <div className="board-actions">
              <select className="filter-dropdown">
                <option value="">All Projects</option>
                <option value="client">Client Projects</option>
                <option value="internal">Internal Projects</option>
                <option value="assigned">Assigned to Me</option>
                <option value="managed">Managed by Me</option>
              </select>
            </div>
          </div>

          {/* Task Tabs Navigation */}
          <div className="project-tabs">
            <button 
              className={`tab-btn ${activeTab === 'todo' ? 'active' : ''}`}
              onClick={() => setActiveTab('todo')}
            >
              To Do <span className="project-count-badge">{projects.todo.length}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'inProgress' ? 'active' : ''}`}
              onClick={() => setActiveTab('inProgress')}
            >
              In Progress <span className="project-count-badge">{projects.inProgress.length}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed <span className="project-count-badge">{projects.completed.length}</span>
            </button>
          </div>

          {/* Project and Tasks Panel Layout */}
          <div className="project-panel">
            <div className={`project-list-container ${showTasksPanel ? 'with-tasks-panel' : ''}`}>
              {renderProjectList(projects[activeTab] || [])}
              {projects[activeTab]?.length === 0 && (
                <div className="empty-state">
                  <p>No projects found in this category</p>
                </div>
              )}
            </div>
            
            {/* Tasks Panel */}
            {showTasksPanel && selectedProject && (
              <div className="tasks-panel">
                <div className="tasks-panel-header">
                  <div>
                    <h3>{selectedProject.title}</h3>
                    <p className="project-client">Client: {selectedProject.clientName || 'No Client'}</p>
                  </div>
                  <div className="tasks-panel-actions">
                    <button 
                      className="edit-project-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsViewModalOpen(true);
                      }}
                    >
                      Edit Project
                    </button>
                    <button 
                      className="close-panel-btn" 
                      onClick={() => {
                        setShowTasksPanel(false);
                        setSelectedProject(null);
                        setSelectedProjectTasks([]);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
                
                <div className="tasks-list-container">
                  <h4>Tasks</h4>
                  {selectedProjectTasks.length === 0 ? (
                    <p className="no-tasks">No tasks found for this project</p>
                  ) : (
                    <ul className="tasks-list">
                      {selectedProjectTasks.map(task => (
                        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                          <div className="task-content">
                            <label className="task-checkbox-container">
                              <input 
                                type="checkbox" 
                                checked={task.completed} 
                                onChange={() => toggleTaskCompletion(task.id, task.completed)}
                              />
                              <span className="checkmark"></span>
                            </label>
                            <span className="task-title">{task.title}</span>
                          </div>
                          <button 
                            className="delete-task-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(task.id);
                            }}
                          >
                            🗑️
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectAdded={handleProjectAdded}
        currentUser={currentUser}
        userName={getUserName()}
      />

      <ProjectViewModal 
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        currentUser={currentUser}
        userName={getUserName()}
      />
    </div>
  );
};

export default Projects;