import React from 'react';
import { Search, Bell, Settings, LogOut, Flame } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search for groups, tasks, or notes..." 
          className={styles.searchInput}
        />
      </div>
<div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
        <Flame size={18} color="#F59E0B" fill="#F59E0B" />
        <span style={{ fontWeight: 800, color: '#F59E0B', fontSize: '0.9rem' }}>7 Day Streak</span>
      </div>

      <div className={styles.actions}>
        <Link to="/notifications" className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.notificationBadge}></span>
        </Link>
        
        <Link to="/settings" className={styles.iconBtn}>
          <Settings size={20} />
        </Link>

        <button className={styles.iconBtn} onClick={logout} title="Logout">
          <LogOut size={20} />
        </button>

        <div className={styles.profile} onClick={() => navigate('/profile')}>
          <div className={styles.profileInfo}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.userRole}>{user?.role}</span>
          </div>
          <img 
            src={user?.avatar || "https://ui-avatars.com/api/?name=" + user?.name + "&background=3B82F6&color=fff"} 
            alt="Profile" 
            className={styles.avatar}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
