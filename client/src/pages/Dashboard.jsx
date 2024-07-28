import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Dashboard(){
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/api/user', { withCredentials: true })
        .then(response => {
            // This is the info carried by the response.data
            /*
            { user_id: 15, first_name: "Hermon", last_name: "Getachew", email: "hermon.getachew@aait.edu.et", password: null, date_of_birth: null, phone_number: null, address: null, status: true, created_at: "2024-07-28T14:10:58.528Z"}
            */
            setName(response.data.first_name);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    const handleLogout = () => {
        axios.post('http://localhost:8080/api/users/logout', {}, { withCredentials: true })
        .then(() => {
            setName('');
            navigate('/login');
        })
        .catch(err => {
            console.log(err);
        });
    };
    
    return(
        <>
        <h1>Hello, {name} </h1>
        <button onClick={handleLogout}>Logout</button>
        </>
    );
}

export default Dashboard;