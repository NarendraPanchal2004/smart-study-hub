import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './AppLayout.module.css';

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={styles.mainContent}>
        <Header toggleSidebar={toggleSidebar} />
        <main className={styles.pageContainer}>
          <div className="fade-in">
            {children}
          </div>
        </main>
      </div>
      {isSidebarOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </div>
  );
};

export default AppLayout;
