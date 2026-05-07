import React, { useState, useEffect } from 'react';
import { Plus, Clock, X, Trash2 } from 'lucide-react';
import { getTimetable, addEvent, deleteEvent } from '../services/timetableService';
import styles from './Timetable.module.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Timetable = () => {
  const today = new Date().toISOString().split('T')[0];
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'study'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getTimetable();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEvent(formData);
      setShowModal(false);
      setFormData({ title: '', date: '', startTime: '', endTime: '', type: 'study' });
      fetchEvents();
    } catch (err) {
      console.error('Failed to add event', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (err) {
      console.error('Failed to delete event', err);
    }
  };

  const getEventsForDay = (dayName) => {
    return events.filter(e => {
      const eventDate = new Date(e.date);
      const eventDay = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
      return eventDay === dayName;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Weekly Timetable</h1>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <Plus size={20} />
          <span>Add Study Session</span>
        </button>
      </div>

      <div className={styles.grid}>
        {days.map(day => (
          <div key={day} className={styles.dayColumn}>
            <div className={styles.dayHeader}>{day.substring(0, 3).toUpperCase()}</div>
            <div className={styles.eventList}>
              {getEventsForDay(day).map(event => (
                <div key={event._id} className={`${styles.eventCard} glass-card`}>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(event._id)}>
                    <Trash2 size={14} />
                  </button>
                  <span className={styles.eventTime}>
                    <Clock size={12} /> {event.startTime} - {event.endTime}
                  </span>
                  <div className={styles.eventTitle}>{event.title}</div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'capitalize', opacity: 0.7 }}>{event.type}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass`}>
            <div className={styles.header}>
              <h2 className={styles.title}>New Session</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Title</label>
                <input 
                  type="text" 
                  className={styles.inputField} 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Date</label>
                <input 
                  type="date" 
                  className={styles.inputField} 
                  value={formData.date}
                  min={today}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Start Time</label>
                  <input 
                    type="time" 
                    className={styles.inputField} 
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>End Time</label>
                  <input 
                    type="time" 
                    className={styles.inputField} 
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Type</label>
                <select 
                  className={styles.inputField}
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="study">Study</option>
                  <option value="exam">Exam</option>
                  <option value="break">Break</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button type="submit" className={styles.submitBtn}>Save Session</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
