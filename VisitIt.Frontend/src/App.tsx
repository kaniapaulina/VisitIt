import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './styles/App.css'
import Home from './pages/Home'

function App() {
  return (
    <>
    <body>
      <div className='appMain'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>}>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
      
    </body>
    </>
  )
}

export default App
