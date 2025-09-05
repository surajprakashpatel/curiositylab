import React, { useState } from 'react';
import '../styles/taskModal.css';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

const TaskModal = ({ isOpen, onClose, onTaskAdded, currentUser, userName }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    startDate: '',
    lastDate: '',
    status: 'todo',
    githubRepo: '',
    projectType: '',
    assignedBy: 'self',
    assignedTo: [],
    visibility: [],
    progress: 0
  });

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      // Initialize with current user's username in assignedTo array if user is logged in
      // Using username only as it's what Firebase is configured to check
      const initialAssignedTo = userName ? [userName] : [];
      const initialVisibility = userName ? [userName] : [];
      
      setTaskData({
        title: '',
        description: '',
        startDate: '',
        lastDate: '',
        status: 'todo',
        githubRepo: '',
        projectType: '',
        assignedBy: 'self',
        assignedTo: initialAssignedTo,
        visibility: initialVisibility,
        progress: 0
      });
    }
  }, [isOpen, userName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting task:', taskData);
      
      // Make sure current user is included in the assignedTo and visibility lists
      let updatedTaskData = { ...taskData };
      
      if (userName) {
        // Ensure the username is in the assignedTo array if not already
        if (!updatedTaskData.assignedTo.includes(userName)) {
          updatedTaskData.assignedTo = [...updatedTaskData.assignedTo, userName];
        }
        
        // Ensure the username is in the visibility array if not already
        if (!updatedTaskData.visibility.includes(userName)) {
          updatedTaskData.visibility = [...updatedTaskData.visibility, userName];
        }
      }
      
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...updatedTaskData,
        createdAt: new Date().toISOString()
      });
      
      const newTask = { id: docRef.id, ...updatedTaskData };
      console.log('Task created successfully:', newTask);
      
      onTaskAdded(newTask);
      onClose();
      
      // Reset form
      setTaskData({
        title: '',
        description: '',
        startDate: '',
        lastDate: '',
        status: 'todo',
        githubRepo: '',
        projectType: '',
        assignedBy: 'self',
        assignedTo: [],
        visibility: [],
        progress: 0
      });
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={taskData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={taskData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastDate">Due Date</label>
              <input
                type="date"
                id="lastDate"
                name="lastDate"
                value={taskData.lastDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={taskData.status}
                onChange={handleChange}
                required
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="projectId">Projects</label>
              <select
                id="projectType"
                name="projectType"
                value={taskData.projectType}
                onChange={handleChange}
                required
              >
                <option value="">Select Project</option>
                <option value="Project1">Project1</option>
                <option value="project2">Project2</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="githubRepo">GitHub Repository Link</label>
            <input
              type="url"
              id="githubRepo"
              name="githubRepo"
              value={taskData.githubRepo}
              onChange={handleChange}
              placeholder="https://github.com/username/repository"
              pattern="https://github.com/.*"
              title="Please enter a valid GitHub repository URL"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;