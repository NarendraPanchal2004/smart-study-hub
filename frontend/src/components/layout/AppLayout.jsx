import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './AppLayout.module.css';

const AppLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <main className={styles.pageContainer}>
          <div className="fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
