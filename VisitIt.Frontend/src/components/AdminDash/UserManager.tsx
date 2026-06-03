import { useState } from 'react';
import styles from './UserManager.module.css';

const initialUsers = [
  { id: 1, name: 'Nates', posts: ["Kocham grafa", 'Graf wroc z wakacji w Hiszpanii', "Boze swiety nie wyspalam sie", "Co tu jeszcze mg dodac"] },
  { id: 2, name: 'Paulina', posts: ['Nates zrob admina', 'Nates naucz sie wymawiac poprawwnie tekst Ta pipa w kebabie damn Wysiadlam na zlym przystanku zamiast aghu 1/10',
    'Do you ever have a dream that you when you smh smh i forgot what the rest of the vine went like oh god this will be in the commits XDD',
    'We have way more to test i mean pewnie daloby sie to zrobic o wiele latwiej ale lowk spalam dzis 4h i chce miec to z glowy this is not it',
    "i am so sleepy graf pls come back i need to focus somehow a z ewronem to sie nie da w ogole WHAT IS THIS DONO MESSAGE I CANT ",
    "this is legit like a test like i feel insane",
    "test131391230"
    ] },
];

export default function UserManager() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFoundUser(null);
      return;
    }
    const user = users.find(u => u.name.toLowerCase() === term.toLowerCase());
    setFoundUser(user || null);
  };

  const deletePost = (userId: number, postIndex: number) => {
    setUsers(prevUsers => {
    const updatedUsers = prevUsers.map(user => {
      if (user.id === userId) {
        const updatedPosts = user.posts.filter((_, i) => i !== postIndex);
        return { ...user, posts: updatedPosts };
      }
      return user;
    });

    const updatedFoundUser = updatedUsers.find(u => u.id === userId);
    setFoundUser(updatedFoundUser || null);
      
    return updatedUsers;
  });
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
          <div>
            <h3>{foundUser.name}</h3>
            <ul className={styles.postList}>
              {foundUser.posts.map((post: string, index: number) => (
                <li key={`${foundUser.id}-${post}`} className={styles.postItem}>
                  {post}
                  <button 
                    onClick={() => deletePost(foundUser.id, index)}
                    className={styles.deleteButton}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
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