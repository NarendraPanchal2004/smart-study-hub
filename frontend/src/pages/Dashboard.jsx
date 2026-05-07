import React from 'react';
import styles from './Dashboard.module.css';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Plus,
  Music,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserGroups } from '../services/groupService';
import { getAnalytics } from '../services/analyticsService';
import { useNavigate } from 'react-router-dom';
import FocusMusic from '../components/dashboard/FocusMusic';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = React.useState([]);
  const [analytics, setAnalytics] = React.useState(null);
  const [sessionSeconds, setSessionSeconds] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    getUserGroups().then(setGroups).catch(console.error);
    getAnalytics().then(setAnalytics).catch(console.error);
  }, []);

  const stats = [
    { 
      label: 'Tasks Completed', 
      value: analytics?.tasks?.completed || '0', 
      icon: <CheckCircle2 className="text-success" />, 
      trend: `${analytics?.tasks?.total || 0} Total` 
    },
    { 
      label: 'Study Hours', 
      value: (() => {
        const historicalSecs = Math.floor((analytics?.study?.totalHours || 0) * 3600);
        const totalSecs = historicalSecs + sessionSeconds;
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;
        return `${h}h ${m}m ${s}s`;
      })(), 
      icon: <Clock className="text-primary" />, 
      trend: sessionSeconds > 0 ? `Active: ${sessionSeconds}s` : 'Total tracked' 
    },
    { 
      label: 'Efficiency', 
      value: `${Math.round(analytics?.tasks?.completionRate || 0)}%`, 
      icon: <TrendingUp className="text-warning" />, 
      trend: 'Task rate' 
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, {user?.name || 'Student'}! 👋</h1>
          <p className={styles.subtitle}>Here's what's happening in your study groups today.</p>
        </div>
        <button className={styles.addBtn} onClick={() => navigate('/timetable')}>
          <Plus size={20} />
          <span>New Study Session</span>
        </button>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card">
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{stat.label}</span>
              {stat.icon}
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statTrend}>{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>
          <section className="glass-card">
            <div className={styles.sectionHeader}>
              <h2>Active Assignments</h2>
              <button className={styles.viewAll}>View All</button>
            </div>
            <div className={styles.taskList}>
              <div className={styles.taskItem}>
                <div className={styles.taskPriority} style={{ backgroundColor: 'var(--accent)' }}></div>
                <div className={styles.taskInfo}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3>Physics Lab Report</h3>
                    <span className={styles.priorityBadge} style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)' }}>High</span>
                  </div>
                  <p>Due: Oct 24, 11:59 PM (Tomorrow)</p>
                </div>
                <div className={styles.taskProgress}>
                  <div className={styles.progressBar} style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className={styles.taskItem}>
                <div className={styles.taskPriority} style={{ backgroundColor: 'var(--warning)' }}></div>
                <div className={styles.taskInfo}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3>Literature Review</h3>
                    <span className={styles.priorityBadge} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>Medium</span>
                  </div>
                  <p>Due: Oct 26, 09:00 AM</p>
                </div>
                <div className={styles.taskProgress}>
                  <div className={styles.progressBar} style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.rightCol}>
          <section className="glass-card">
            <div className={styles.sectionHeader}>
              <h2>Quick Glance</h2>
            </div>
            <div className={styles.calendarMini}>
              <div className={styles.calItem}>
                <div className={styles.calDate}>24 OCT</div>
                <div className={styles.calInfo}>
                  <h4>Physics Group Session</h4>
                  <span>4:00 PM - 6:00 PM</span>
                </div>
              </div>
              <div className={styles.calItem}>
                <div className={styles.calDate}>25 OCT</div>
                <div className={styles.calInfo}>
                  <h4>Math Quiz Prep</h4>
                  <span>2:00 PM - 3:30 PM</span>
                </div>
              </div>
            </div>
          </section>

          <section className="glass-card" style={{ marginTop: 'var(--spacing-lg)' }}>
            <div className={styles.sectionHeader}>
              <h2>Study Groups</h2>
            </div>
            <div className={styles.groupList}>
              {groups.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No groups yet. Join or create one!</p>
              ) : (
                groups.slice(0, 3).map(group => (
                  <div key={group._id} className={styles.groupItem}>
                    <div className={styles.groupAvatar}>
                      {group.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className={styles.groupInfo}>
                      <h4>{group.name}</h4>
                      <span>{group.members.length} Members Online</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
          <FocusMusic />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
