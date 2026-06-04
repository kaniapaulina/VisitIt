import {Login} from '../../components/LoginForm/Login';
import './LoginPage.css'


const LoginPage = () => {
    return (
        <main>
            <div className="login-container">
                <img src="/assets/starysky.jpg"></img>
                <Login/>
            </div>
        </main>
        
    );
}

export default LoginPage;