import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import DataTable from 'react-data-table-component';
import styles from './Analytics.module.css'; 
import { useState } from 'react';

const countryData = [
  { name: 'Poland', rating: 4.8, visits: 4200, planned: 1500 },
  { name: 'Spain', rating: 4.7, visits: 5000, planned: 1600 },
  { name: 'Italy', rating: 4.6, visits: 4500, planned: 1300 },
  { name: 'Greece', rating: 4.5, visits: 3100, planned: 100 },
  { name: 'France', rating: 4.4, visits: 3800, planned: 200 },
  { name: 'Germany', rating: 4.3, visits: 4800, planned: 1200 },
  { name: 'Portugal', rating: 4.6, visits: 2900, planned: 800 },
  { name: 'Croatia', rating: 4.5, visits: 3500, planned: 950 },
  { name: 'Norway', rating: 4.9, visits: 2200, planned: 1800 },
  { name: 'Netherlands', rating: 4.2, visits: 4100, planned: 600 },
  { name: 'Switzerland', rating: 4.7, visits: 1900, planned: 1400 },
  { name: 'Austria', rating: 4.4, visits: 2700, planned: 500 },
  { name: 'United Kingdom', rating: 3.9, visits: 5500, planned: 400 },
  { name: 'Sweden', rating: 4.3, visits: 2400, planned: 700 },
  { name: 'Czech Republic', rating: 4.1, visits: 3300, planned: 300 }
];

const columns = [
  { name: 'Country', selector: (row: any) => row.name, sortable: true },
  { name: 'Rating', selector: (row: any) => row.rating, sortable: true },
  { name: 'Visits', selector: (row: any) => row.visits, sortable: true },
  { name: 'Planned', selector: (row: any) => row.planned, sortable: true },
];

const topRatedData = [...countryData]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 10);

const topVisitedData = [...countryData]
  .sort((a, b) => b.visits - a.visits)
  .slice(0, 10);



const customStyles = {
  table: { style: { borderRadius: '16px', overflow: 'hidden' } },
  headRow: { style: { backgroundColor: '#1a6855', color: '#fff' } },
  cells: { style: { padding: '16px' } },
};

export default function DataAnalytics() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredData = countryData.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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