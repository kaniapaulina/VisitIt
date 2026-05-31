import './NavStyle.css'
import {Link, useNavigate} from 'react-router-dom'
import { FaSignOutAlt} from 'react-icons/fa';
import { PiAlienDuotone } from "react-icons/pi";

const Nav = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/')
    }

    return(
        <>
        <nav className="navbar">
            <div className="nav-header">
                <Link to="/user" className="home-link">
                <div className="nav-brand">VisitMe</div>
                </Link>
            </div>
            
            <div className="nav-links">
                <a href="#"> <PiAlienDuotone/> My Visits</a>
                <a href="#"> <PiAlienDuotone/> World Wide Friendhub</a>
            </div>

            <div className="nav-footer">
                <Link to="/user/profile" className="nav-profile-link">
                <div className="user-info">
                    <div className="user-avatar">👤</div>
                    <div className="user-details">
                        <strong>Natalia</strong>
                        <span>Visit Profile</span>
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