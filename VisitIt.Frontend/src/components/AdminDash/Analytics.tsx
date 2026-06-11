import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import DataTable from 'react-data-table-component';
import styles from './Analytics.module.css'; 
import { useState, useEffect } from 'react';

export default function DataAnalytics() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetch('https://localhost:7201/api/journeys/analytics', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch(err => console.error("Error fetching analytics:", err));
  }, []);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topRatedData = [...data].sort((a, b) => b.rating - a.rating).slice(0, 10);
  const topVisitedData = [...data].sort((a, b) => b.visits - a.visits).slice(0, 10);

  if (loading) return <p>Loading analytics...</p>;

const columns = [
  { name: 'Country', selector: (row: any) => row.name, sortable: true },
  { name: 'Rating', selector: (row: any) => row.rating, sortable: true },
  { name: 'Visits', selector: (row: any) => row.visits, sortable: true },
];

const customStyles = {
  table: { style: { borderRadius: '16px', overflow: 'hidden' } },
  headRow: { style: { backgroundColor: '#1a6855', color: '#fff' } },
  cells: { style: { padding: '16px' } },
};

  return (
    <div className={styles.analyticsContainer}>
      <h1 className={styles.pageTitle}>Analytics</h1>
      <div className={styles.chartCard}>
        <h3>Highest ranked countries</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topRatedData}> 
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="rating" fill="#1a6855" />
          </BarChart>
        </ResponsiveContainer>
</div>

<div className={styles.chartCard}>
  <h3>Most visited countries</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={topVisitedData}> 
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="visits" fill="#1a6855" />
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
        
      <div className={styles.tableSection}>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        customStyles={customStyles}
        noDataComponent={<p>No countries found</p>}
      />
    </div>
      </div>
    </div>
  );
}
