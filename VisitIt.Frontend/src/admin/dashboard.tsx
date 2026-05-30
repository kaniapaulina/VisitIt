import styles from './Dashboard.module.css';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, LineChart, Line, CartesianGrid 
} from 'recharts';

const countryPopularityData = [
  { name: 'Polska', value: 400 },
  { name: 'Niemcy', value: 300 },
  { name: 'Francja', value: 300 },
  { name: 'USA', value: 200 },
];

const bestRatedCountriesData = [
  { name: 'Japonia', rating: 4.9 },
  { name: 'Włochy', rating: 4.8 },
  { name: 'Hiszpania', rating: 4.7 },
];

const popularityOverTimeData = [
  { date: 'Sty', visits: 1200 },
  { date: 'Lut', visits: 1900 },
  { date: 'Mar', visits: 1500 },
];

const COLORS = ['#3b82f6', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Zarządzanie</h2>
        <div className={styles.manageBox}>Panel użytkownika</div>
      </aside>

      <main className={styles.mainContent}>
        <h1>Admin Overview</h1>
        
        <div className={styles.chartContainer}>
          <div className={styles.chartCard}>
            <h3>Popularność w czasie</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={popularityOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <h3>Popularność krajów</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                {/* <Pie data={countryPopularityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label>
                 {countryPopularityData.map((entry, index) => <Shape key={index} fill={COLORS[index % COLORS.length]} />)} 
                </Pie> */}
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <h3>Najlepiej oceniane</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={bestRatedCountriesData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="rating" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}