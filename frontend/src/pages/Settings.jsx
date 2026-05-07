import React from 'react';
import { Bell, Moon, Lock, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import styles from './Profile.module.css'; // Reusing some styles

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [focusMode, setFocusMode] = React.useState(false);

  return (
    <div className={styles.container}>
      <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Settings</h1>
      
      <div className="taskList">
        <section className="glass-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="var(--primary)" /> Notifications
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Study Session Reminders</span>
              <input type="checkbox" defaultChecked />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Group Chat Messages</span>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </section>

        <section className="glass-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Moon size={20} color="var(--secondary)" /> Appearance & Experience
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Dark Mode</span>
              <input 
                type="checkbox" 
                checked={isDarkMode} 
                onChange={toggleTheme} 
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Focus Mode <EyeOff size={14} style={{ opacity: 0.5 }} />
              </span>
              <input 
                type="checkbox" 
                checked={focusMode} 
                onChange={(e) => {
                  setFocusMode(e.target.checked);
                  if (e.target.checked) {
                    document.body.classList.add('focus-mode');
                  } else {
                    document.body.classList.remove('focus-mode');
                  }
                }} 
              />
            </div>
          </div>
        </section>

        <section className="glass-card">
          <h3 style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={20} color="var(--accent)" /> Security
          </h3>
          <button className="glass" style={{ padding: '8px 16px', borderRadius: '8px', color: 'var(--text-primary)' }}>
            Change Password
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
