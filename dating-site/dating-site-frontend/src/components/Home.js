// src/components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
    <div>
        <h1>Welcome to Our Dating Site!</h1>
        <nav>
            <Link to="/register">Register</Link> | 
            <Link to="/login">Login</Link>
        </nav>
    </div>
);

export default Home;
