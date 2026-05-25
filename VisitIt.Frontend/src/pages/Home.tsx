import Nav from '../components/Sidebar/Nav';
import Content from '../components/Map/Content';
import Aside from '../components/Blog/Aside';
import './Home.css';

const Home = () => {
  return (
    <div className="dashboard">
        <div className='nav-block'>
            <Nav />
        </div>      
      <div className='main-block'>
            <div className="main-content">
                <Content />
            </div>
        
            <div className="right-content">
                <Aside />
            </div>
        </div>
    </div>
  );
};

export default Home;