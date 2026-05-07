import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, Clock, CheckCircle, BookOpen } from 'lucide-react';
import { getAnalytics } from '../services/analyticsService';
import styles from './Analytics.module.css';

const COLORS = ['#3B82F6', '#F43F5E', '#10B981', '#F59E0B'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const result = await getAnalytics();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Analyzing your progress...</div>;
  if (!data) return <div>No data available yet. Start studying to see your analytics!</div>;

  const pieData = [
    { name: 'Completed', value: data.tasks.completed },
    { name: 'Pending', value: data.tasks.pending },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Study Analytics</h1>
      </div>

      <div className={styles.statsRow}>
        <div className="glass-card">
          <div className={styles.statItem}>
            <Clock size={24} color="var(--primary)" style={{ marginBottom: '8px' }} />
            <span className={styles.statValue}>{data.study.totalHours}h</span>
            <span className={styles.statLabel}>Study Hours</span>
          </div>
        </div>
        <div className="glass-card">
          <div className={styles.statItem}>
            <CheckCircle size={24} color="var(--success)" style={{ marginBottom: '8px' }} />
            <span className={styles.statValue}>{data.tasks.completionRate.toFixed(1)}%</span>
            <span className={styles.statLabel}>Task Completion</span>
          </div>
        </div>
        <div className="glass-card">
          <div className={styles.statItem}>
            <BookOpen size={24} color="var(--secondary)" style={{ marginBottom: '8px' }} />
            <span className={styles.statValue}>{data.activity.notes}</span>
            <span className={styles.statLabel}>Notes Written</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.chartCard} glass-card ${styles.fullWidth}`}>
          <h3 className={styles.chartTitle}><TrendingUp size={20} /> Weekly Study Hours</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.study.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="hours" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${styles.chartCard} glass-card`}>
          <h3 className={styles.chartTitle}>Task Distribution</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${styles.chartCard} glass-card`}>
          <h3 className={styles.chartTitle}>Efficiency Score</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>
                {Math.round(data.tasks.completionRate)}
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>Keep it up!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
