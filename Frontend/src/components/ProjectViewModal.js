import React, { useState, useEffect } from 'react';
import '../styles/taskModal.css';
import '../styles/projectStyles.css';
import '../styles/projectViewModal.css';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';

const ProjectViewModal = ({ isOpen, onClose, project, currentUser, userName }) => {
  const [editMode, setEditMode] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [clientName, setClientName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    dueDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      setProjectData(project);
      fetchClients();
      fetchUsers();
      fetchClientName(project.clientId);
      fetchProjectTasks(project.id);
    }
  }, [isOpen, project]);

  const fetchClients = async () => {
    try {
      const q = query(collection(db, 'users'), where('accountType', '==', 'client'));
      const querySnapshot = await getDocs(q);
      
      const clientsList = [];
      querySnapshot.forEach((doc) => {
        clientsList.push({ id: doc.id, ...doc.data() });
      });
      
      setClients(clientsList);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'users'), where('accountType', 'in', ['user', 'admin']));
      const querySnapshot = await getDocs(q);
      
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchClientName = async (clientId) => {
    if (!clientId) {
      setClientName('No Client');
      return;
    }
    
    try {
      const clientDoc = await getDoc(doc(db, 'users', clientId));
      if (clientDoc.exists()) {
        const clientData = clientDoc.data();
        setClientName(clientData.displayName || clientData.username || clientData.email || 'Unknown Client');
      } else {
        setClientName('Unknown Client');
      }
    } catch (error) {
      console.error('Error fetching client:', error);
      setClientName('Unknown Client');
    }
  };

  const fetchProjectTasks = async (projectId) => {
    try {
      const q = query(collection(db, 'projects', projectId, 'tasks'));
      const querySnapshot = await getDocs(q);
      
      const tasksList = [];
      querySnapshot.forEach((doc) => {
        tasksList.push({ id: doc.id, ...doc.data() });
      });
      
      setTasks(tasksList);
    } catch (error) {
      console.error('Error fetching project tasks:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    
    setProjectData(prev => ({
      ...prev,
      [name]: selectedValues
    }));
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProject = async () => {
    try {
      setIsLoading(true);
      
      // Update project in Firestore
      const projectRef = doc(db, 'projects', projectData.id);
      await updateDoc(projectRef, {
        title: projectData.title,
        description: projectData.description,
        status: projectData.status,
        dueDate: projectData.dueDate,
        githubRepo: projectData.githubRepo,
        liveLink: projectData.liveLink,
        clientId: projectData.clientId,
        assignedTo: projectData.assignedTo,
        managers: projectData.managers,
        updatedAt: new Date().toISOString()
      });
      
      setEditMode(false);
      setIsLoading(false);
      alert('Project updated successfully!');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.title || !newTask.description) {
      alert('Please fill in all required fields for the task.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Add task to project's tasks subcollection
      const taskRef = await addDoc(collection(db, 'projects', projectData.id, 'tasks'), {
        ...newTask,
        createdAt: new Date().toISOString(),
        createdBy: currentUser ? currentUser.uid : null,
        assignedTo: currentUser ? [currentUser.uid] : [],
        completed: false
      });
      
      // Add new task to local state
      setTasks(prev => [
        { id: taskRef.id, ...newTask, createdAt: new Date().toISOString(), completed: false },
        ...prev
      ]);
      
      // Reset new task form
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        dueDate: ''
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
      setIsLoading(false);
    }
  };
  
  const deleteTask = async (taskId) => {
    if (!projectData) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setIsLoading(true);
        
        // Delete from Firestore
        const taskRef = doc(db, 'projects', projectData.id, 'tasks', taskId);
        await deleteDoc(taskRef);
        
        // Remove from local state
        setTasks(prev => prev.filter(task => task.id !== taskId));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
        setIsLoading(false);
      }
    }
  };
  
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    if (!projectData) return;
    
    try {
      setIsLoading(true);
      
      // Update in Firestore
      const taskRef = doc(db, 'projects', projectData.id, 'tasks', taskId);
      await updateDoc(taskRef, {
        completed: !currentStatus
      });
      
      // Update in local state
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? {...task, completed: !currentStatus} 
            : task
        )
      );
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating task status:', error);
      setIsLoading(false);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      return user.displayName || user.username || user.email || 'Unknown User';
    }
    return 'Unknown User';
  };

  if (!isOpen || !project) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content project-view-modal">
        <div className="modal-header">
          <h2>{editMode ? 'Edit Project' : 'Project Details'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {!editMode ? (
            <div className="project-details">
              <h3>{projectData?.title}</h3>
              
              <div className="detail-row">
                <div className="detail-label">Status:</div>
                <div className={`status-badge ${projectData?.status}`}>
                  {projectData?.status === 'todo' ? 'To Do' : 
                   projectData?.status === 'inProgress' ? 'In Progress' : 'Completed'}
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">Client:</div>
                <div>{clientName}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">Description:</div>
                <div className="detail-description">{projectData?.description}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">Start Date:</div>
                <div>{projectData?.startDate ? new Date(projectData.startDate).toLocaleDateString() : 'Not set'}</div>
              </div>
              
              {projectData?.dueDate && (
                <div className="detail-row">
                  <div className="detail-label">Due Date:</div>
                  <div>{new Date(projectData.dueDate).toLocaleDateString()}</div>
                </div>
              )}
              
              <div className="detail-row">
                <div className="detail-label">Links:</div>
                <div className="detail-links">
                  {projectData?.githubRepo && (
                    <a 
                      href={projectData.githubRepo} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="github-link"
                    >
                      📂 GitHub Repository
                    </a>
                  )}
                  {projectData?.liveLink && (
                    <a 
                      href={projectData.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="live-link"
                    >
                      🌐 Live Site
                    </a>
                  )}
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">Assigned To:</div>
                <div className="detail-users">
                  {projectData?.assignedTo?.map(userId => (
                    <span key={userId} className="user-badge">
                      {getUserName(userId)}
                    </span>
                  ))}
                </div>
              </div>
              
              {projectData?.managers?.length > 0 && (
                <div className="detail-row">
                  <div className="detail-label">Managers:</div>
                  <div className="detail-users">
                    {projectData.managers.map(userId => (
                      <span key={userId} className="manager-badge">
                        {getUserName(userId)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="project-actions">
                <button 
                  className="edit-btn"
                  onClick={() => setEditMode(true)}
                >
                  Edit Project
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSaveProject(); }}>
              <div className="form-group">
                <label htmlFor="title">Project Title <span className="required">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={projectData?.title || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description <span className="required">*</span></label>
                <textarea
                  id="description"
                  name="description"
                  value={projectData?.description || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date <span className="required">*</span></label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={projectData?.startDate || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={projectData?.dueDate || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Status <span className="required">*</span></label>
                  <select
                    id="status"
                    name="status"
                    value={projectData?.status || 'todo'}
                    onChange={handleChange}
                    required
                  >
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="clientId">Client</label>
                  <select
                    id="clientId"
                    name="clientId"
                    value={projectData?.clientId || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.displayName || client.username || client.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="githubRepo">GitHub Repository Link</label>
                  <input
                    type="url"
                    id="githubRepo"
                    name="githubRepo"
                    value={projectData?.githubRepo || ''}
                    onChange={handleChange}
                    placeholder="https://github.com/username/repository"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="liveLink">Live Link</label>
                  <input
                    type="url"
                    id="liveLink"
                    name="liveLink"
                    value={projectData?.liveLink || ''}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assignedTo">Assigned To</label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    multiple
                    value={projectData?.assignedTo || []}
                    onChange={handleMultiSelectChange}
                    className="multi-select"
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.displayName || user.username || user.email}
                      </option>
                    ))}
                  </select>
                  <small>Hold Ctrl/Cmd to select multiple users</small>
                </div>

                <div className="form-group">
                  <label htmlFor="managers">Project Managers</label>
                  <select
                    id="managers"
                    name="managers"
                    multiple
                    value={projectData?.managers || []}
                    onChange={handleMultiSelectChange}
                    className="multi-select"
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.displayName || user.username || user.email}
                      </option>
                    ))}
                  </select>
                  <small>Hold Ctrl/Cmd to select multiple managers</small>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          )}
          
          {/* Project Tasks Section */}
          <div className="project-tasks-section">
            <h3>Project Tasks</h3>
            
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="add-task-form">
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleTaskChange}
                    placeholder="Task title"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="description"
                    value={newTask.description}
                    onChange={handleTaskChange}
                    placeholder="Task description"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <select
                    name="status"
                    value={newTask.status}
                    onChange={handleTaskChange}
                  >
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-group">
                  <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleTaskChange}
                    placeholder="Due date"
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="add-task-btn" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Task'}
                  </button>
                </div>
              </div>
            </form>
            
            {/* Tasks List */}
            <div className="tasks-list">
              {tasks.length > 0 ? (
                // Sort tasks: uncompleted first, then completed
                [...tasks].sort((a, b) => {
                  if ((a.completed || false) === (b.completed || false)) return 0;
                  return (a.completed || false) ? 1 : -1;
                }).map(task => (
                  <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                    <div className="task-header">
                      <div className="task-title-container">
                        <label className="task-checkbox-container">
                          <input 
                            type="checkbox" 
                            checked={task.completed || false} 
                            onChange={() => toggleTaskCompletion(task.id, task.completed || false)}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <h4 className={task.completed ? 'completed-task' : ''}>{task.title}</h4>
                      </div>
                      <div className="task-actions">
                        <span className={`task-status ${task.status}`}>
                          {task.status === 'todo' ? 'To Do' : 
                          task.status === 'inProgress' ? 'In Progress' : 'Completed'}
                        </span>
                        <button 
                          className="delete-task-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                          title="Delete task"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className={task.completed ? 'completed-task' : ''}>{task.description}</p>
                    {task.dueDate && (
                      <div className="task-due-date">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-tasks">
                  <p>No tasks added to this project yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectViewModal;
