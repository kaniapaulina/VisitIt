import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'

import './styles/App.css'
import AdminDashboard from './pages/admin/AdminDashboard';
import Analytics from './components/AdminDash/Analytics';
import UserManager from './components/AdminDash/UserManager';
import UserHome from './pages/user/UserHome';

// function App() {
//   return (
//     <>
//     <body>
//       <div className='appMain'>
//         <BrowserRouter>

//           <Routes>
//             <Route path="/" element={<Landing />} />
//             <Route path="/user" element={<UserHome/>}></Route>
//             <Route path="/admin" element={<AdminDashboard/>}></Route>
//           </Routes>
//         </BrowserRouter>
//       </div>
      
//     </body>
//     </>
//   )
// }

function App() {
  return (
    <div className='appMain'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/user" element={<UserHome />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="" element={<Analytics />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="users" element={<UserManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
