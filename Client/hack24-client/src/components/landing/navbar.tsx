"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import '@/styles/landing/navbar.css';

const Navbar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    const handleProfileClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUserData(null);
        setIsDropdownOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navItem_name">
                <Link href="/">Palestra</Link>
            </div>
            <div className="navItem">
                <Link href="/explorar" className="navLink">Explorar</Link>
                <Link href="/misclases" className="navLink">Mis Clases</Link>
            </div>
            <div className="navItem_profile">
                <button onClick={handleProfileClick} className="navLink">Mi Perfil</button>
                {isDropdownOpen && (
                    <div className="dropdown">
                        {userData ? (
                            <div>
                                <p>Nombre: {userData.name}</p>
                                <p>Región: {userData.region}</p>
                                <p>Profesor: {userData.teacher}</p>
                                <p>Zona Horaria: {userData.timezone}</p>
                                <button onClick={handleLogout}>Cerrar Sesión</button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <button>Iniciar Sesión</button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;