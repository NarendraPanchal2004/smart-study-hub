import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CheckSquare, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Zap,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PomodoroTimer from './PomodoroTimer';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Groups', path: '/groups' },
    { icon: <Calendar size={20} />, label: 'Timetable', path: '/timetable' },
    { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/tasks' },
    { icon: <BookOpen size={20} />, label: 'Notes Pad', path: '/notes' },
    { icon: <Zap size={20} />, label: 'Digital Library', path: '/library' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ icon: <Shield size={20} />, label: 'Admin Panel', path: '/admin' });
  }

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.logoContainer}>
        <Zap className={styles.logoIcon} size={28} fill="currentColor" />
        <span className={styles.logoText}>StudySync</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink 
            key={item.label} 
            to={item.path}
            onClick={() => { if (window.innerWidth <= 768) toggleSidebar(); }}
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <PomodoroTimer />
        
        <NavLink to="/join" className={styles.joinBtn} onClick={() => { if (window.innerWidth <= 768) toggleSidebar(); }}>
          Join a Group
        </NavLink>
        
        <button className={styles.logoutBtn} onClick={logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
