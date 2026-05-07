import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';
import { getTasks, addTask, updateTask, deleteTask } from '../services/taskService';
import styles from './Tasks.module.css';

const Tasks = () => {
  const today = new Date().toISOString().split('T')[0];
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
    category: 'reading'
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTask(formData);
      setShowModal(false);
      setFormData({ title: '', description: '', deadline: '', priority: 'medium', category: 'reading' });
      fetchTasks();
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Daily Goals & Tasks</h1>
        <button className={styles.addTaskBtn} onClick={() => setShowModal(true)}>
          <Plus size={20} />
          <span>Add New Task</span>
        </button>
      </div>

      <div className={styles.taskStats}>
        <div className={`${styles.statCard} glass-card`}>
          <span className={styles.statValue}>{tasks.length}</span>
          <span className={styles.statLabel}>Total Tasks</span>
        </div>
        <div className={`${styles.statCard} glass-card`}>
          <span className={styles.statValue} style={{ color: 'var(--success)' }}>{completedCount}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={`${styles.statCard} glass-card`}>
          <span className={styles.statValue} style={{ color: 'var(--accent)' }}>{tasks.length - completedCount}</span>
          <span className={styles.statLabel}>Pending</span>
        </div>
      </div>

      <div className={styles.taskList}>
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No tasks for today. Add one to get started!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className={`${styles.taskItem} glass-card`}>
              <div 
                className={`${styles.checkbox} ${task.completed ? styles.checked : ''}`}
                onClick={() => handleToggleComplete(task)}
              >
                {task.completed && <Check size={14} color="white" />}
              </div>
              
              <div className={styles.taskContent}>
                <span className={`${styles.taskTitle} ${task.completed ? styles.completedText : ''}`}>
                  {task.title}
                </span>
                <div className={styles.taskMeta}>
                  <span className={`${styles.priority} ${styles[task.priority]}`}>{task.priority}</span>
                  {task.deadline && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={12} /> {task.category}
                  </span>
                </div>
              </div>

              <button className={styles.deleteBtn} onClick={() => handleDelete(task._id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass`}>
            <div className={styles.header}>
              <h2 className={styles.title}>New Task</h2>
              <button onClick={() => setShowModal(false)}>X</button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="What needs to be done?" 
                className={styles.inputField}
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <textarea 
                placeholder="Description (Optional)" 
                className={styles.inputField}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Deadline</label>
                  <input 
                    type="date" 
                    className={styles.inputField}
                    value={formData.deadline}
                    min={today}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Priority</label>
                  <select 
                    className={styles.inputField}
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <button type="submit" className={styles.addTaskBtn} style={{ justifyContent: 'center', marginTop: '1rem' }}>
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
