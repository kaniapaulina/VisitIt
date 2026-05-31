import styles from './dashboard.module.css';
import UserManagement from '../../components/Admin/UserManager';
import Analytics from '../../components/Admin/Analytics';

export default function AdminDashboard() {
  return (
    <div className={styles.pageWrapper}>
      <header className={styles.topNavbar}>
        <h1>Admin Overview</h1>
      </header>
    <div className={styles.container}>
      <div className={styles.dashboardBody}>
        <section className={styles.managementSection}>
          <h1>User Management</h1>
          <UserManagement />
        </section>

        <section className={styles.analyticsSection}>
          <h1>General Statistics</h1>
          <Analytics />
        </section>
      </div>       
    </div>
    </div>
  );
}