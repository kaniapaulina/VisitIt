import './NavStyle.css'

const Nav = () => {
    return(
        <>
        <nav className="navbar">
            <div className="nav-logo">VisitMe</div>
            <div className="nav-links">
                <a href="#">Dashboard</a>
                <a href="#">My Visits</a>
                <a href="#">World Wide Friendhub</a>
                <a href="#">Message</a>
            </div>
            <div className="nav-footer">
                <div className="user-info">
                <div className="user-avatar">👤</div>
                <div className="user-details">
                    <strong>Natalia</strong>
                    <span>View Profile</span>
                </div>
                </div>
            </div>
        </nav>
        </>
    )
}

export default Nav