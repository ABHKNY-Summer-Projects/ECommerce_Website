import { useState } from "react";
import axios from 'axios';
import { useLocation } from "react-router-dom";

function Dashboard(){
    const location = useLocation();
    const name = location.state.name;
    
    return(
        <h1>Hello, {name} </h1>
    );
}

export default Dashboard;