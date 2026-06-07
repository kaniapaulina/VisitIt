import styles from './dashboard.module.css';

import { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className={styles.pageWrapper}>
      <nav className={styles.sideBar}>
        <h2>Admin Panel</h2>
        <div className={styles.navSection}>
          <span className={styles.navTitle}>Navigation</span>
          
          <NavLink to="users" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
            User Management
          </NavLink>
 
          <NavLink to="analytics" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
            Analytics
          </NavLink>
        </div>
        <div className={styles.userSection}>
            <img src="https://d1jyxxz9imt9yb.cloudfront.net/medialib/3078/image/s768x1300/IP202207_GlassFrogs_009_365211_reduced.jpg" alt="User" className={styles.userAvatar} />
            <span className={styles.userName}>Admin</span>
         </div>
      </nav>

      <main className={styles.mainContent}>
        <div className={styles.dashboardBody}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}