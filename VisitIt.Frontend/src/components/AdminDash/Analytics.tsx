import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import styles from './Analytics.module.css'; 
import { useState } from 'react';

const countryData = [
  { name: 'Polska', rating: 4.8, visits: 4200, planned: 1500 },
  { name: 'Hiszpania', rating: 4.7, visits: 5000, planned: 1600 },
  { name: 'Włochy', rating: 4.6, visits: 4500, planned: 1300 },
  { name: 'Grecja', rating: 4.5, visits: 3100, planned: 100},
  { name: 'Francja', rating: 4.4, visits: 3800, planned: 200 },
];

export default function DataAnalytics() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredData = countryData.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.analyticsContainer}>
      
      <div className={styles.chartCard}>
        <h3>Highest ranked countries</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="rating" fill="#99d78f" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.chartCard}>
        <h3>Most visited countries</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="visits" fill="#99d78f" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.tableSection}>
        <input 
          type="text" 
          placeholder="Filter" 
          className={styles.filterInput}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Country</th>
              <th>Rating</th>
              <th>Visits</th>
              <th>Planned Visits</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.rating}</td>
                <td>{row.visits}</td>
                <td>{row.planned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}