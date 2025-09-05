import React, { useState, useEffect, useCallback } from 'react';
import '../styles/taskModal.css';
import SubtaskModal from './SubtaskModal';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const TaskViewModal = ({ isOpen, onClose, task, currentUser, userName }) => {
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);

  const fetchSubtasks = useCallback(async () => {
    try {
      if (!task?.id) return;
      
      const q = query(
        collection(db, 'tasks', task.id, 'subtasks'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedSubtasks = [];
      let weight = 0;
      
      querySnapshot.forEach((doc) => {
        const subtask = { id: doc.id, ...doc.data() };
        fetchedSubtasks.push(subtask);
        weight += subtask.weight;
      });

      setSubtasks(fetchedSubtasks);
      setTotalWeight(weight);
    } catch (error) {
      console.error('Error fetching subtasks:', error);
    }
  }, [task?.id]);

  useEffect(() => {
    if (task?.id) {
      fetchSubtasks();
    }
  }, [task?.id, fetchSubtasks]);

  const handleSubtaskAdded = (newSubtask) => {
    setSubtasks(prev => [newSubtask, ...prev]);
    setTotalWeight(prev => prev + newSubtask.weight);
  };

  if (!isOpen || !task) return null;

  // Check if the current user is assigned to this task using only username
  const isAssigned = userName && task && task.assignedTo && Array.isArray(task.assignedTo) && 
    task.assignedTo.includes(userName);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Task Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="task-details">
          <div className="detail-group">
            <label>Title</label>
            <h3 className="detail-value">{task.title}</h3>
          </div>

          <div className="detail-group">
            <label>Description</label>
            <p className="detail-value detail-description">{task.description}</p>
          </div>

          <div className="detail-row">
            <div className="detail-group">
              <label>Status</label>
              <span className={`status-badge ${task.status}`}>
                {task.status === 'inProgress' ? 'In Progress' : task.status}
              </span>
            </div>

            <div className="detail-group">
              <label>Project Type</label>
              <span className="project-type-badge">{task.projectType}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-group">
              <label>Start Date</label>
              <p className="detail-value">{task.startDate}</p>
            </div>

            <div className="detail-group">
              <label>Due Date</label>
              <p className="detail-value">{task.lastDate}</p>
            </div>
          </div>

          {task.githubRepo && (
            <div className="detail-group">
              <label>GitHub Repository</label>
              <a 
                href={task.githubRepo}
                className="github-link-detail"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="github-icon">📂</span> {task.githubRepo}
              </a>
            </div>
          )}

          {/* Subtasks Section */}
          <div className="subtasks-section">
            <div className="subtasks-header">
              <h3>Subtasks ({subtasks.length})</h3>
              {isAssigned && (
                <button 
                  className="new-subtask-btn" 
                  onClick={() => setIsSubtaskModalOpen(true)}
                  disabled={totalWeight >= 100}
                >
                  Add Subtask
                </button>
              )}
            </div>
            
            {totalWeight > 100 && (
              <p className="weight-warning">
                Warning: Subtasks total weight exceeds 100% of the task.
              </p>
            )}
            
            <div className="subtasks-list">
              {subtasks.length === 0 ? (
                <p>No subtasks yet.</p>
              ) : (
                subtasks.map(subtask => (
                  <div key={subtask.id} className="subtask-card">
                    <div className="subtask-header">
                      <h4>{subtask.title}</h4>
                      <span className="subtask-weight">{subtask.weight}%</span>
                    </div>
                    <p className="subtask-description">{subtask.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <SubtaskModal 
        isOpen={isSubtaskModalOpen}
        onClose={() => setIsSubtaskModalOpen(false)}
        parentTask={task}
        onSubtaskAdded={handleSubtaskAdded}
      />
    </div>
  );
};

export default TaskViewModal;