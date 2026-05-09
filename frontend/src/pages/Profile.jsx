import React, { useState } from 'react';
import { Camera, User, Mail, Shield, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    institution: user?.institution || '',
    role: user?.role || 'Student'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        institution: formData.institution
      });
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>User Profile</h1>
      
      <div className={`${styles.profileCard} glass-card`}>
        <div className={styles.avatarSection}>
          <img 
            src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff"} 
            alt="Profile" 
            className={styles.avatarLarge} 
          />
          <div className={styles.editOverlay}>
            <Camera size={16} />
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.inputGroup}>
            <label><User size={14} /> Full Name</label>
            <input 
              type="text" 
              className={styles.inputField} 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className={styles.inputGroup}>
            <label><Mail size={14} /> Email Address</label>
            <input 
              type="email" 
              className={styles.inputField} 
              value={formData.email}
              readOnly
              style={{ opacity: 0.7 }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label><Shield size={14} /> Role</label>
            <input 
              type="text" 
              className={styles.inputField} 
              value={formData.role}
              readOnly
              style={{ opacity: 0.7 }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Institution</label>
            <input 
              type="text" 
              className={styles.inputField} 
              value={formData.institution}
              onChange={(e) => setFormData({...formData, institution: e.target.value})}
            />
          </div>
          <div className={`${styles.inputGroup} styles.fullWidth`}>
            <label>Bio</label>
            <textarea 
              className={styles.inputField} 
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
          </div>
          <button type="submit" disabled={isSaving} className={`${styles.saveBtn} ${styles.fullWidth}`} style={{ opacity: isSaving ? 0.7 : 1 }}>
            <Save size={20} />
            <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
