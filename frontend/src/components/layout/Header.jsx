import { Search, Bell, Settings, LogOut, Flame, Menu } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search..." 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.streakBadge}>
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

        <button className={styles.logoutBtn} onClick={logout} title="Logout">
          <LogOut size={20} />
        </button>

        <div className={styles.profile} onClick={() => navigate('/profile')}>
          <div className={styles.profileInfo}>
            <span className={styles.userName}>{user?.name}</span>
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
