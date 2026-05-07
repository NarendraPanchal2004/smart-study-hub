import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, Mail, Calendar, ShieldCheck } from 'lucide-react';
import styles from './Profile.module.css'; // Reusing some styles

const AdminPanel = () => {
  const { getAllUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1>Admin Panel</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and monitor platform users</p>
        </div>
        <div className="glass" style={{ padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users size={24} color="var(--primary)" />
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{users.length} Total Users</span>
        </div>
      </div>

      <div className="taskList">
        <section className="glass-card">
          <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={20} color="var(--primary)" /> User Management List
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '12px' }}>User</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Role</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={u.avatar} 
                          alt={u.name} 
                          style={{ width: '32px', height: '32px', borderRadius: '50%' }} 
                        />
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={14} /> {u.email}
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        background: u.role === 'Admin' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: u.role === 'Admin' ? 'var(--success)' : 'var(--primary)',
                        border: `1px solid ${u.role === 'Admin' ? 'var(--success)' : 'var(--primary)'}44`
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                        <ShieldCheck size={14} /> Active
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
