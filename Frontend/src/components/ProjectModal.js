import React, { useState, useEffect } from 'react';
import '../styles/taskModal.css';
import '../styles/projectStyles.css';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const ProjectModal = ({ isOpen, onClose, onProjectAdded, currentUser, userName }) => {
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0], // Default to today
    dueDate: '',
    status: 'todo',
    githubRepo: '',
    liveLink: '',
    clientId: '',
    assignedTo: [],
    managers: [],
    tasks: []
  });

  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch clients and users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchClients();
      fetchUsers();
      
      // Initialize with current user's ID in assignedTo array
      const initialAssignedTo = currentUser ? [currentUser.uid] : [];
      
      setProjectData({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0], // Default to today
        dueDate: '',
        status: 'todo',
        githubRepo: '',
        liveLink: '',
        clientId: '',
        assignedTo: initialAssignedTo,
        managers: [],
        tasks: []
      });
    }
  }, [isOpen, currentUser]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, 'users'), where('accountType', '==', 'client'));
      const querySnapshot = await getDocs(q);
      
      const clientsList = [];
      querySnapshot.forEach((doc) => {
        clientsList.push({ id: doc.id, ...doc.data() });
      });
      
      setClients(clientsList);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, 'users'), where('accountType', 'in', ['user', 'admin']));
      const querySnapshot = await getDocs(q);
      
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      
      setUsers(usersList);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsLoading(false);
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
  
  const addUser = (userId, field) => {
    if (userId && !projectData[field].includes(userId)) {
      setProjectData(prev => ({
        ...prev,
        [field]: [...prev[field], userId]
      }));
    }
  };
  
  const removeUser = (userId, field) => {
    setProjectData(prev => ({
      ...prev,
      [field]: prev[field].filter(id => id !== userId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      console.log('Submitting project:', projectData);
      
      // Make sure current user is included in the assignedTo list
      let updatedProjectData = { ...projectData };
      
      if (currentUser && !updatedProjectData.assignedTo.includes(currentUser.uid)) {
        updatedProjectData.assignedTo = [...updatedProjectData.assignedTo, currentUser.uid];
      }
      
      // Add project to Firestore
      const docRef = await addDoc(collection(db, 'projects'), {
        ...updatedProjectData,
        createdAt: new Date().toISOString(),
        createdBy: currentUser ? currentUser.uid : null
      });
      
      const newProject = { id: docRef.id, ...updatedProjectData };
      console.log('Project created successfully:', newProject);
      
      onProjectAdded(newProject);
      onClose();
      setIsLoading(false);
      
      // Reset form
      setProjectData({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        status: 'todo',
        githubRepo: '',
        liveLink: '',
        clientId: '',
        assignedTo: [],
        managers: [],
        tasks: []
      });
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to create project. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content project-modal">
        <div className="modal-header">
          <h2>Create New Project</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Project Title <span className="required">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              value={projectData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description <span className="required">*</span></label>
            <textarea
              id="description"
              name="description"
              value={projectData.description}
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
                value={projectData.startDate}
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
                value={projectData.dueDate}
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
                value={projectData.status}
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
                value={projectData.clientId}
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
                value={projectData.githubRepo}
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
                value={projectData.liveLink}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignedUsers">Assigned Users</label>
              <div className="user-selection-container">
                <div className="selected-users">
                  {projectData.assignedTo.map(userId => {
                    const user = users.find(u => u.id === userId);
                    return user ? (
                      <div key={userId} className="selected-user-chip">
                        <span>{user.displayName || user.username || user.email}</span>
                        <button 
                          type="button" 
                          className="remove-user-btn"
                          onClick={() => removeUser(userId, 'assignedTo')}
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
                <div className="user-dropdown-container">
                  <select
                    className="user-dropdown"
                    onChange={(e) => {
                      addUser(e.target.value, 'assignedTo');
                      e.target.value = ''; // Reset dropdown after selection
                    }}
                    value=""
                  >
                    <option value="">Add user...</option>
                    {users
                      .filter(user => !projectData.assignedTo.includes(user.id))
                      .map(user => (
                        <option key={user.id} value={user.id}>
                          {user.displayName || user.username || user.email}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="managers">Project Managers</label>
              <div className="user-selection-container">
                <div className="selected-users">
                  {projectData.managers.map(userId => {
                    const user = users.find(u => u.id === userId);
                    return user ? (
                      <div key={userId} className="selected-user-chip manager-chip">
                        <span>{user.displayName || user.username || user.email}</span>
                        <button 
                          type="button" 
                          className="remove-user-btn"
                          onClick={() => removeUser(userId, 'managers')}
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
                <div className="user-dropdown-container">
                  <select
                    className="user-dropdown"
                    onChange={(e) => {
                      addUser(e.target.value, 'managers');
                      e.target.value = ''; // Reset dropdown after selection
                    }}
                    value=""
                  >
                    <option value="">Add manager...</option>
                    {users
                      .filter(user => !projectData.managers.includes(user.id))
                      .map(user => (
                        <option key={user.id} value={user.id}>
                          {user.displayName || user.username || user.email}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
