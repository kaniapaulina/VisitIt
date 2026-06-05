import Login from '../../components/LoginForm/Login';
import './LoginPage.css'


const LoginPage = () => {
    return (
        <main>
            <div className="login-container">
                <div className='one'>
                    <img src="/assets/pixelforest.jpg" alt="Forest Welcome Graphic" />
                </div>
                
                <div className='two'>
                    <Login />
                </div>
            </div>
        </main>
        
    );
}

export default LoginPage;