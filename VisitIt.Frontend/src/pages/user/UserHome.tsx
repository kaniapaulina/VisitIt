import Nav from '../../components/Sidebar/Nav';
import Content from '../../components/Map/Content';
import Aside from '../../components/Blog/Aside';
import Calendar from '../../components/Calendar/Calendar';
import './Home.css';

const UserHome = () => {
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
                <div className="calendar-wrapper" style={{ width: '100%' }}>
                <Calendar 
                    visitedDates={[]} 
                    onDateClick={() => {}} 
                        />
                </div>
                <Aside />
            </div>
        </div>
    </div>
  );
};

export default UserHome;