import Link from 'next/link';
import React from 'react';
import '@/styles/landing/navbar.css';

const Navbar: React.FC = () => {
  return (
        <nav className="navbar">
            <div className="navItem_name">
              <Link href="/" className="navLink" style={{fontSize:"25px"}}>Hack</Link>
            </div>
            <div className="navItem">
              <Link href="/explorar" className="navLink" style={{fontSize:"15px"}}>Explorar</Link>
              <Link href="/misClases" className="navLink" style={{fontSize:"15px"}}>Mis Clases</Link>
            </div>
            <div className="navItem_profile">
              <Link href="/" className="navLink" style={{fontSize:"20px"}}>Mi Perfil</Link>
            </div>
        </nav>
      );
    
};

export default Navbar;
