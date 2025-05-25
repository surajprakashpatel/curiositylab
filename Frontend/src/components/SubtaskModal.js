import React, { useState } from 'react';
import '../styles/taskModal.css';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

const SubtaskModal = ({ isOpen, onClose, parentTask, onSubtaskAdded }) => {
  const [subtaskData, setSubtaskData] = useState({
    title: '',
    description: '',
    weight: 0, // percentage of parent task (0-100)
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubtaskData(prev => ({
      ...prev,
      [name]: name === 'weight' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating subtask for task:', parentTask.id);
      
      const subtaskDoc = {
        ...subtaskData,
        parentTaskId: parentTask.id,
        status: parentTask.status,
        startDate: parentTask.startDate,
        lastDate: parentTask.lastDate,
        projectType: parentTask.projectType,
        githubRepo: parentTask.githubRepo,
        assignedBy: parentTask.assignedBy,
        assignedTo: parentTask.assignedTo,
        visibility: parentTask.visibility,
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'tasks', parentTask.id, 'subtasks'), subtaskDoc);
      console.log('Subtask created successfully:', docRef.id);

      const newSubtask = { id: docRef.id, ...subtaskDoc };
      onSubtaskAdded(newSubtask);
      onClose();
      setSubtaskData({
        title: '',
        description: '',
        weight: 0,
      });
    } catch (error) {
      console.error('Error adding subtask:', error);
      alert('Failed to create subtask. Please try again.');
    }
  };

  if (!isOpen || !parentTask) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Subtask</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Subtask Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={subtaskData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={subtaskData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight (% of parent task)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              min="0"
              max="100"
              value={subtaskData.weight}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Create Subtask</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubtaskModal;