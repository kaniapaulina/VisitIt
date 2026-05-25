import './App.css'

import Nav from './pages/Nav'
import Aside from './pages/Aside'
import Content from './pages/Content'

function App() {
  return (
    <>
    <body>
      <div className='appMain'>
        <Nav/>
        <div className='layout'>
          <Content/>
          <Aside/>
        </div>
    </div>
    </body>
    </>
  )
}

export default App
