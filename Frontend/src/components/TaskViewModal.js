import React, { useState, useEffect, useCallback } from 'react';
import '../styles/taskModal.css';
import SubtaskModal from './SubtaskModal';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const TaskViewModal = ({ isOpen, onClose, task }) => {
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
            <p className="detail-value">{task.title}</p>
          </div>

          <div className="detail-group">
            <label>Description</label>
            <p className="detail-value detail-description">{task.description}</p>
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

          <div className="detail-row">
            <div className="detail-group">
              <label>Status</label>
              <p className={`status-badge ${task.status}`}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </p>
            </div>
            <div className="detail-group">
              <label>Project Type</label>
              <p className="project-type-badge">{task.projectType}</p>
            </div>
          </div>

          {task.githubRepo && (
            <div className="detail-group">
              <label>GitHub Repository</label>
              <a 
                href={task.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="github-link-detail"
              >
                <span className="github-icon">📂</span>
                {task.githubRepo}
              </a>
            </div>
          )}

          {/* Subtasks Section */}
          <div className="detail-group subtasks-section">
            <div className="subtasks-header">
              <label>Subtasks ({subtasks.length})</label>
              <button 
                className="new-subtask-btn"
                onClick={() => setIsSubtaskModalOpen(true)}
                disabled={totalWeight >= 100}
              >
                + Add Subtask
              </button>
            </div>
            {totalWeight > 100 && (
              <p className="weight-warning">
                Total weight exceeds 100%. Please adjust subtask weights.
              </p>
            )}
            <div className="subtasks-list">
              {subtasks.map(subtask => (
                <div key={subtask.id} className="subtask-card">
                  <div className="subtask-header">
                    <h4>{subtask.title}</h4>
                    <span className="subtask-weight">{subtask.weight}%</span>
                  </div>
                  <p className="subtask-description">{subtask.description}</p>
                  <div className="subtask-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${subtask.progress}%` }}
                      />
                    </div>
                    <span className="progress-text">{subtask.progress}%</span>
                  </div>
                </div>
              ))}
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