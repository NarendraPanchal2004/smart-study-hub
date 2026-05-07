import React from 'react';
import { Bell, MessageSquare, Calendar, Target, UserPlus } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { 
      id: 1, 
      type: 'chat', 
      title: 'New message in MHT CET', 
      desc: 'Atul: Check the new PDF I uploaded.',
      time: '2 mins ago',
      icon: <MessageSquare size={18} color="var(--primary)" />
    },
    { 
      id: 2, 
      type: 'calendar', 
      title: 'Upcoming Session', 
      desc: 'Physics Group Session starts in 30 minutes.',
      time: '25 mins ago',
      icon: <Calendar size={18} color="var(--secondary)" />
    },
    { 
      id: 3, 
      type: 'task', 
      title: 'Task Reminder', 
      desc: 'Solve MHT-CET 2023 Paper is due today.',
      time: '1 hour ago',
      icon: <Target size={18} color="var(--warning)" />
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Notifications</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {notifications.map(n => (
          <div key={n.id} className="glass-card" style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {n.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{n.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{n.desc}</p>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
