import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import {auth_image, googleIcon} from '../assets/assets'
import '../styles/auth.css';

function Login(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        fetch('http://localhost:4000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log(data.user);
                navigate('/dashboard', { state: { name: data.user.name } });
            } else {
                console.log(data.message);
                setLoginError(data.message);
            }
        });
    };

    const handleGoogleSignIn = (e) => {
        window.location.href = 'http://localhost:4000/auth/google';
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
                <span>{loginError}</span>
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