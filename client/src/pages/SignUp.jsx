import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import {auth_image, googleIcon} from '../assets/assets'
import '../styles/auth.css';

function SignUp(){
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const [formMessages, setFormMessages] = useState([]);

    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/users/signup', { firstName, lastName, email, password, password2 }, {withCredentials: true});
            
            const data = response.data;
            setFormMessages(response.data.messages);
            
        } 
        catch (error) {
            console.error(error);
        }

    }

    const handleGoogleSignIn = async (e) => {
        window.location.href = 'http://localhost:8080/api/auth/google';
    };

    return(
    <form onSubmit={handleRegister} className="auth-form">
        <div className="auth-image-container">
            <img src={auth_image}/>
        </div>
        <div className="auth-form-fields">
            <h1> Create an account</h1>
            <p>Enter your details below</p>

            <div className="auth-errors-list">
                <ul>
                    {formMessages.map((error, index) => (
                        <li key={index}>{error.message}</li>
                    ))}
                </ul>
            </div>

            <input 
                type="text" 
                value={ firstName } 
                placeholder="First Name" 
                onChange={(e) => setFirstName(e.target.value)} 
            />
        
            <input 
                type="text" 
                value={ lastName } 
                placeholder="Last Name" 
                onChange={(e) => setLastName(e.target.value)} 
            />

            <input 
                type="text" 
                value={ email } 
                placeholder="Email" 
                required
                onChange={(e) => setEmail(e.target.value)} 
            />

            <input 
                type="password" 
                value={ password } 
                placeholder="Password" 
                required
                onChange={(e) => setPassword(e.target.value)} 
            />

            <input 
                type="password"
                value={ password2 } 
                placeholder="Confirm password" 
                required
                onChange={(e) => setPassword2(e.target.value)} 
            />

            <button type="submit" className="auth-form-submit">
                Create Account    
            </button>

            <button onClick={handleGoogleSignIn} className="auth-google-button">
                <img src={googleIcon}/>
                Continue with Google
            </button>
            
            <div className="auth-form-existing-account">
                <p>Already have account?</p>
                <a href="/login">Login</a>
            </div>
        </div>
        </form>
    );
}
export default SignUp;