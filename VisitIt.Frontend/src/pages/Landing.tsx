// pages/Landing.tsx
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-card">
        <h1>VisitMe</h1>
        <div className="role-buttons">
          <button onClick={() => navigate('/user')} className="btn-user">
            User
          </button>
          <button onClick={() => navigate('/admin')} className="btn-admin">
            Panel administratora
          </button>
        </div>
        <div className="login-link">
          <a href="/login">Login - TODO</a>
        </div>
      </div>
    </div>
  );
};

export default Landing;