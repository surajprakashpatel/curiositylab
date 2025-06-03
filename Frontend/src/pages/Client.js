import React, { useState, useEffect } from 'react';
import '../styles/tasks.css';
import '../styles/client.css';
import { db } from '../services/firebase';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useGithub } from '../contexts/GithubContext';
import { useNavigate } from 'react-router-dom';

const Client = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const { fetchGithubApi, githubToken } = useGithub();
  const [projects, setProjects] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [projectDetails, setProjectDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') !== 'false');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  const [commits, setCommits] = useState([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState(null);

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
        console.log('Current user:', currentUser.uid);
        console.log('User profile:', userProfile);
        
        // Get all projects
        const projectsRef = collection(db, 'projects');
        const projectsSnapshot = await getDocs(projectsRef);
        const allProjects = [];
        
        projectsSnapshot.forEach((projectDoc) => {
          const projectData = projectDoc.data();
          allProjects.push({ id: projectDoc.id, ...projectData });
        });
        
        console.log('All projects:', allProjects);
        
        // Filter projects where current user is the client
        const projectsList = [];
        
        for (const project of allProjects) {
          console.log('Checking project:', project.title || project.name, project);
          
          // Check if clientId matches current user's UID
          if (project.clientId === currentUser.uid) {
            console.log('Match on clientId');
            projectsList.push(project);
            continue;
          }
          
          // Check if client field matches current user's UID as a string
          if (project.client === currentUser.uid) {
            console.log('Match on client field');
            projectsList.push(project);
            continue;
          }
          
          // Check if client is an object with an id field
          if (project.client && typeof project.client === 'object' && project.client.id === currentUser.uid) {
            console.log('Match on client object');
            projectsList.push(project);
            continue;
          }
          
          // Check if user is in the assignedTo array
          if (project.assignedTo && Array.isArray(project.assignedTo) && 
              project.assignedTo.includes(currentUser.uid)) {
            console.log('Match on assignedTo');
            projectsList.push(project);
            continue;
          }
          
          // Check if user is in the projectManagers array
          if (project.projectManagers && Array.isArray(project.projectManagers) && 
              project.projectManagers.includes(currentUser.uid)) {
            console.log('Match on projectManagers');
            projectsList.push(project);
            continue;
          }
          
          // Check if clientName matches user's display name or email
          if (userProfile.displayName && project.clientName === userProfile.displayName) {
            console.log('Match on clientName with displayName');
            projectsList.push(project);
            continue;
          }
          
          if (userProfile.email && project.clientName === userProfile.email) {
            console.log('Match on clientName with email');
            projectsList.push(project);
            continue;
          }
        }
        
        console.log('Filtered projects:', projectsList);
        
        // Sort by createdAt
        projectsList.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        setProjects(projectsList);
        
        // Fetch detailed information for each project
        const detailsPromises = projectsList.map(async (project) => {
          const projectData = { ...project };
          
          // Fetch assigned users
          if (project.assignedTo && project.assignedTo.length > 0) {
            const assignedUsers = await Promise.all(project.assignedTo.map(async (userId) => {
              const userDoc = await getDoc(doc(db, 'users', userId));
              if (userDoc.exists()) {
                return { id: userId, ...userDoc.data() };
              }
              return { id: userId, displayName: 'Unknown User' };
            }));
            projectData.assignedUsers = assignedUsers;
          } else {
            projectData.assignedUsers = [];
          }
          
          // Fetch project managers
          if (project.projectManagers && project.projectManagers.length > 0) {
            const managers = await Promise.all(project.projectManagers.map(async (userId) => {
              const userDoc = await getDoc(doc(db, 'users', userId));
              if (userDoc.exists()) {
                return { id: userId, ...userDoc.data() };
              }
              return { id: userId, displayName: 'Unknown Manager' };
            }));
            projectData.managerUsers = managers;
          } else {
            projectData.managerUsers = [];
          }
          
          // Fetch tasks for this project
          const tasksQuery = query(collection(db, 'projects', project.id, 'tasks'));
          const tasksSnapshot = await getDocs(tasksQuery);
          const tasks = [];
          
          tasksSnapshot.forEach((taskDoc) => {
            tasks.push({ id: taskDoc.id, ...taskDoc.data() });
          });
          
          // Sort tasks by completion status (uncompleted first)
          tasks.sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
          });
          
          projectData.tasks = tasks;
          
          return { id: project.id, data: projectData };
        });
        
        const detailsResults = await Promise.all(detailsPromises);
        const detailsMap = {};
        
        detailsResults.forEach(result => {
          detailsMap[result.id] = result.data;
        });
        
        setProjectDetails(detailsMap);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [currentUser, userProfile]);
  
  // Log projects for debugging
  useEffect(() => {
    console.log('Current projects:', projects);
    console.log('Project details:', projectDetails);
  }, [projects, projectDetails]);

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
      case 'inProgress': return 'green';
      case 'completed': return 'blue';
      case 'on-hold': return 'orange';
      case 'cancelled': return 'red';
      case 'todo': return 'gray';
      default: return 'gray';
    }
  };
  
  // Get active projects count
  const getActiveProjectsCount = () => {
    return projects.filter(p => p.status === 'active' || p.status === 'inProgress' || p.status === 'todo').length;
  };
  
  // Get completed projects count
  const getCompletedProjectsCount = () => {
    return projects.filter(p => p.status === 'completed').length;
  };
  
  // Get on-hold projects count
  const getOnHoldProjectsCount = () => {
    return projects.filter(p => p.status === 'on-hold').length;
  };
  
  // Toggle project expansion
  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };
  
  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Not set';
    return new Date(timestamp).toLocaleDateString();
  };

  // Fetch repository commits
  useEffect(() => {
    const fetchRepositoryCommits = async () => {
      if (!currentUser) return;
      
      try {
        setRepoLoading(true);
        setRepoError(null);
        
        // First approach: Try to find projects with githubRepo field
        const projectsWithRepos = projects.filter(p => p.githubRepo);
          
        if (projectsWithRepos.length === 0) {
          console.log('No projects with GitHub repositories found');
          setCommits([]);
          setRepoLoading(false);
          return;
        }
        
        console.log(`Found ${projectsWithRepos.length} projects with GitHub repositories`);
          
        // Extract repository information from projects
        const allCommits = [];
        let successfulRepos = 0;
          
        for (const project of projectsWithRepos) {
          if (!project.githubRepo) continue;
            
          try {
            // Parse repository URL to get owner and repo name
            const url = new URL(project.githubRepo);
            const pathParts = url.pathname.split('/').filter(Boolean);
              
            if (pathParts.length < 2) {
              console.error(`Invalid repository URL format for project ${project.name || project.title}: ${project.githubRepo}`);
              continue;
            }
              
            const owner = pathParts[0];
            const repo = pathParts[1];
              
            // Use the GitHub context to fetch data with centralized token
            console.log(`Fetching commits for ${owner}/${repo}`);
            
            try {
              const commitsData = await fetchGithubApi(`/repos/${owner}/${repo}/commits?per_page=10`);
              
              const repoCommits = commitsData.map(commit => ({
                id: commit.sha,
                message: commit.commit.message,
                author: commit.commit.author.name,
                date: commit.commit.author.date,
                projectName: project.name || project.title,
                repositoryUrl: project.githubRepo,
                commitUrl: commit.html_url
              }));
                
              allCommits.push(...repoCommits);
              successfulRepos++;
              console.log(`Found ${repoCommits.length} commits for ${project.name || project.title}`);
            } catch (error) {
              console.error(`Failed to fetch commits for ${owner}/${repo}:`, error.message);
              // Continue with other repositories even if one fails
            }
          } catch (error) {
            console.error(`Error processing repository for project ${project.name || project.title}:`, error.message);
          }
        }
        
        console.log(`Successfully fetched commits from ${successfulRepos} of ${projectsWithRepos.length} repositories`);
          
        if (allCommits.length === 0) {
          setRepoError('No commits found in any repository. Check repository access permissions.');
        } else {
          // Sort all commits by date (newest first)
          allCommits.sort((a, b) => new Date(b.date) - new Date(a.date));
          console.log(`Total commits found: ${allCommits.length}`);
        }
          
        setCommits(allCommits);
        setRepoLoading(false);
      } catch (error) {
        console.error('Error fetching repository commits:', error);
        setRepoError(`Failed to load repository data: ${error.message}`);
        setRepoLoading(false);
      }
    };

    fetchRepositoryCommits();
  }, [currentUser, projects, fetchGithubApi]);
  
  // Format date for commits
  const formatCommitDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Truncate commit message
  const truncateMessage = (message, maxLength = 100) => {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
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
            <li className="active">
              <span className="icon">📁</span> {!sidebarCollapsed && <span>Projects</span>}
            </li>
            <li>
              <span className="icon">💬</span> {!sidebarCollapsed && <span>Messages</span>}
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

      {/* Main Content */}
      <main className="main-content client-main-content">
        {/* Header */}
        <header className="header">
          <div className="admin-title">
            <h1>Client Dashboard</h1>
          </div>
          <div className="user-menu">
            <button className="theme-toggle" onClick={toggleDarkMode}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="user-profile">
              <span className="avatar">{userProfile?.displayName?.[0] || userProfile?.username?.[0] || 'C'}</span>
              <span className="user-name">{userProfile?.displayName || userProfile?.username || 'Client'}</span>
            </div>
          </div>
        </header>

        <div className="client-dashboard">

          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Active Projects</h3>
              <p className="stat-value">{getActiveProjectsCount()}</p>
            </div>
            <div className="stat-card">
              <h3>Completed Projects</h3>
              <p className="stat-value">{getCompletedProjectsCount()}</p>
            </div>
            <div className="stat-card">
              <h3>On Hold</h3>
              <p className="stat-value">{getOnHoldProjectsCount()}</p>
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
              <div className="projects-list">
                {projects.map(project => {
                  const projectDetail = projectDetails[project.id] || project;
                  const isExpanded = expandedProjects[project.id] || false;
                  const tasks = projectDetail.tasks || [];
                  
                  return (
                    <div key={project.id} className="admin-project-card">
                      <div className="project-header">
                        <div className="project-main-info">
                          <h3>{project.name || project.title}</h3>
                          <span 
                            className="status-badge" 
                            style={{ backgroundColor: getStatusColor(project.status) }}
                          >
                            {project.status === 'todo' ? 'To Do' :
                             project.status === 'inProgress' ? 'In Progress' :
                             project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                          {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="live-link">
                              🔗 Live Link
                            </a>
                          )}
                          <button 
                            className="details-button"
                            onClick={() => toggleProjectExpansion(project.id)}
                          >
                            {isExpanded ? 'Hide Details' : 'Show Details'}
                          </button>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="project-details">
                          <div className="project-info">
                            <h4>Project Details</h4>
                            <p><strong>Description:</strong> {project.description || 'No description provided'}</p>
                            <p><strong>Start Date:</strong> {formatDate(project.startDate)}</p>
                            <p><strong>Due Date:</strong> {formatDate(project.dueDate)}</p>
                            <p><strong>Created:</strong> {formatDate(project.createdAt)}</p>
                            <p><strong>Type:</strong> {project.projectType || 'Not specified'}</p>
                          </div>
                          
                          <div className="project-users">
                            <div className="assigned-users">
                              <h4>Assigned Team</h4>
                              {projectDetail.assignedUsers?.length > 0 ? (
                                <div className="user-chips">
                                  {projectDetail.assignedUsers.map(user => (
                                    <span key={user.id} className="user-chip">
                                      {user.displayName || user.email || 'Unknown'}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p>No team members assigned</p>
                              )}
                            </div>
                            
                            <div className="project-managers">
                              <h4>Project Managers</h4>
                              {projectDetail.managerUsers?.length > 0 ? (
                                <div className="user-chips">
                                  {projectDetail.managerUsers.map(manager => (
                                    <span key={manager.id} className="manager-chip">
                                      {manager.displayName || manager.email || 'Unknown'}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p>No managers assigned</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="project-tasks">
                        <h4>Tasks</h4>
                        {tasks.length > 0 ? (
                          <ul className="tasks-list">
                            {tasks.map(task => (
                              <li 
                                key={task.id} 
                                className={`task-item ${task.completed ? 'completed' : ''}`}
                              >
                                <div className="task-content">
                                  <span className="task-status-icon">
                                    {task.completed ? '✅' : '⬜'}
                                  </span>
                                  <span className="task-title">{task.title}</span>
                                </div>
                                <div className="task-meta">
                                  Due: {formatDate(task.dueDate)}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No tasks for this project</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="recent-activity">
            <h2>Repository Activity</h2>
            <div className="activity-timeline">
              {repoLoading ? (
                <div className="loading">Loading commit history...</div>
              ) : repoError ? (
                <div className="error-message">{repoError}</div>
              ) : commits.length > 0 ? (
                <div className="timeline-items">
                  {commits.map((commit, index) => (
                    <div 
                      className="timeline-item" 
                      key={commit.id}
                      style={{"--index": index}}
                    >
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>
                          <a href={commit.commitUrl} target="_blank" rel="noopener noreferrer" className="commit-link">
                            {truncateMessage(commit.message, 70)}
                          </a>
                        </h4>
                        <p>Repository: {commit.projectName}</p>
                        <p>Author: {commit.author}</p>
                        <small>{formatCommitDate(commit.date)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No repository commits found. Make sure your projects have linked repositories.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Client;
