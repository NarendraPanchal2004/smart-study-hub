import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Request permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const sendNotification = (title, options = {}) => {
    // Browser Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/logo192.png',
        ...options
      });
    }

    // App Notification
    const newNotif = {
      id: Date.now(),
      title,
      desc: options.body || '',
      time: 'Just now',
      ...options
    };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, sendNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
