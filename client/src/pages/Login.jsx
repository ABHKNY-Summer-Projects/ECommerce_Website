import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {auth_image, googleIcon} from '../assets/assets'
import '../styles/auth.css';

function Login(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try{    
            const response = await axios.post('http://localhost:8080/api/users/login', { email, password }, {withCredentials: true})

            const data = response.data;
            if (data.status === 'success') {
                navigate('/dashboard');
            } 
            else {
                setLoginError(data.message);
            }
        }

        catch(err) {
            console.error(err);
            setLoginError('An error occurred during login');
        }
    };

    const handleGoogleSignIn = async (e) => {
        window.location.href = 'http://localhost:8080/api/auth/google';
    };

    return(
    <form onSubmit={handleLogin} className="auth-form">
        <div className="auth-image-container">
            <img src={auth_image}/>
        </div>
        <div className="auth-form-fields">
            <h1> Log in</h1>
            <p>Enter your details below</p>

            <div className="auth-errors-list">
                <span>{loginError && loginError.message}</span>
            </div>

            <input 
                type="text" 
                id="email" 
                name="email" 
                placeholder="Email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required/>

            <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required/>

            <button type="submit" className="auth-form-submit">
                Log in   
            </button>
            
            <button onClick={handleGoogleSignIn} className="auth-google-button">
                <img src={googleIcon}/>
                Continue with Google
            </button>
            
            <div className="auth-form-forgot-account">
                <a href="/pathforLogin">Forgot password?</a>
            </div>
        </div>
    </form>
    );
}

export default Login;