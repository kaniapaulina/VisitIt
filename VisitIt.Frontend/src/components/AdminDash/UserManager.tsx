import { useState, useEffect } from 'react';
import styles from './UserManager.module.css';

export default function UserManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    fetch('https://localhost:7201/api/users', {
      method: 'GET',
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error('Błąd autoryzacji lub serwera');
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => console.error("Fetch users error:", err));
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFoundUser(null);
      return;
    }
    const user = users.find(u => u.username.toLowerCase() === term.toLowerCase());
    setFoundUser(user || null);
  };

  const handleBan = async (userId: number) => {
    try {
      const response = await fetch(`https://localhost:7201/api/users/toggle-ban/${userId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === userId ? { ...user, isBanned: result.isBanned } : user
        ));
        
        if (foundUser && foundUser.id === userId) {
          setFoundUser({ ...foundUser, isBanned: result.isBanned });
        }
      }
    } catch (err) {
      console.error("Ban error:", err);
    }
  };

  return (
    <div className={styles.managerContainer}>
      <h1 className={styles.pageTitle}>User Management</h1>
      
      <input 
        className={styles.searchInput}
        type="text" 
        value={searchTerm} 
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search for username..."
      />

      <div className={styles.resultsArea}>
        {foundUser ? (
          <div className={styles.userCard}>
            <h3>{foundUser.username}</h3>
            <p>Status: {foundUser.isBanned ? '🔴 Zbanowany' : '🟢 Aktywny'}</p>
            
            <button 
              onClick={() => handleBan(foundUser.id)}
              className={foundUser.isBanned ? styles.unbanButton : styles.banButton}
            >
              {foundUser.isBanned ? 'Unban User' : 'Ban User'}
            </button>
          </div>
        ) : (
          searchTerm && <p>No user found</p>
        )}
      </div>

      <p className={styles.userCount}>
        Total users: <strong>{users.length}</strong>
      </p>
    </div>
  );
}