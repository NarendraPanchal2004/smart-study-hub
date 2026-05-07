import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, X, Save } from 'lucide-react';
import { getNotes, addNote, updateNote, deleteNote } from '../services/noteService';
import styles from './Notes.module.css';

const colors = ['#3B82F6', '#F43F5E', '#10B981', '#F59E0B', '#6366F1', '#A855F7'];

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    color: '#3B82F6'
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '', color: '#3B82F6' });
    setShowModal(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content, color: note.color });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await updateNote(editingNote._id, formData);
      } else {
        await addNote(formData);
      }
      setShowModal(false);
      fetchNotes();
    } catch (err) {
      console.error('Failed to save note', err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNote(id);
      fetchNotes();
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notes Pad</h1>
        <button className={styles.addNoteBtn} onClick={handleOpenAdd}>
          <Plus size={20} />
          <span>New Note</span>
        </button>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <p>Loading notes...</p>
        ) : notes.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <Edit3 size={48} style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }} />
            <h3>No notes yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Click 'New Note' to start writing.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div 
              key={note._id} 
              className={`${styles.noteCard} glass-card`}
              style={{ borderLeft: `4px solid ${note.color}` }}
              onClick={() => handleOpenEdit(note)}
            >
              <div className={styles.noteHeader}>
                <h3 className={styles.noteTitle}>{note.title}</h3>
                <button className={styles.deleteBtn} onClick={(e) => handleDelete(e, note._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <p className={styles.noteContent}>{note.content}</p>
              <div className={styles.noteFooter}>
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                <Edit3 size={14} style={{ opacity: 0.5 }} />
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass`}>
            <div className={styles.header}>
              <h2 className={styles.title}>{editingNote ? 'Edit Note' : 'New Note'}</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Title" 
                className={styles.titleInput}
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <textarea 
                placeholder="Start writing..." 
                className={styles.contentInput}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
              />
              <div className={styles.colorPicker}>
                {colors.map(c => (
                  <div 
                    key={c}
                    className={`${styles.colorOption} ${formData.color === c ? styles.selectedColor : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setFormData({...formData, color: c})}
                  />
                ))}
              </div>
              <button type="submit" className={styles.addNoteBtn} style={{ justifyContent: 'center', marginTop: '1rem' }}>
                <Save size={20} />
                <span>Save Note</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
