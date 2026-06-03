import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'

import './styles/App.css'
import AdminDashboard from './pages/admin/AdminDashboard';
import UserHome from './pages/user/UserHome';

function App() {
  return (
      <div className='appMain'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/user" element={<UserHome/>}></Route>
            <Route path="/admin" element={<AdminDashboard/>}></Route>
          </Routes>
        </BrowserRouter>
      </div>
  )
}

export default App;
