import './NavStyle.css'
import {Link, useNavigate} from 'react-router-dom'
import { FaSignOutAlt} from 'react-icons/fa';
import { useAuth } from '../../context/useAuth';

const Nav = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return(
        <>
        <nav className="navbar">
            <div className='nav-header-wrapper'>
                <div className="nav-header">
                    <Link to="/dashboard" className="home-link">
                    <div className="nav-brand">VisitIt</div>
                    <p className='underscore'>click me if you're lost!</p>
                    </Link>
                </div>
            </div>

            <div className='nav-menu'>
                <div className='menu-link'>
                    <Link to='/dashboard' className='link'>FYP</Link>
                </div>
                <div className='menu-link'>
                    <Link to='/dashboard' className='link'>Newsletter</Link>
                </div>
                <div className='menu-link'>
                    <Link to='/dashboard' className='link'>Friendhub</Link>
                </div>
            </div>

        

            <div className="nav-footer">
                <Link to="/user/profile" className="nav-profile-link">
                    <div className="user-info">
                        <div className="user-avatar"></div>
                        <div className="user-details">
                            <strong>{user?.username}</strong>
                            <p>Settings</p>
                        </div>
                    </div>
                </Link>
                <div className="logout-button">
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>
        </nav>
        </>
    )
}

export default Nav