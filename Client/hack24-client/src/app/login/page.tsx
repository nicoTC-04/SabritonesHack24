"use client";
import React, { useState } from 'react';
import './../../styles/login/style.css';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        try {
            const response = await fetch('http://216.238.66.189:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful', data);
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(data));
                // Redirect to the home page
                window.location.href = '/';
            } else {
                console.error('Login failed', data);
                // Handle login failure here (e.g., show an error message)
            }
        } catch (error) {
            console.error('An error occurred', error);
            // Handle network or other errors here
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
};

export default LoginPage;