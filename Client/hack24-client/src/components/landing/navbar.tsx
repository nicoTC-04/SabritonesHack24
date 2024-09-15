import Link from 'next/link';
import React from 'react';
import '@/styles/landing/navbar.css';

const Navbar: React.FC = () => {
  return (
        <nav className="navbar">
            <div className="navItem_name">
              <Link href="/" >Palestra</Link>
            </div>
            <div className="navItem">
              <Link href="/explorar" className="navLink">Explorar</Link>
              <Link href="/misclases" className="navLink">Mis Clases</Link>
            </div>
            <div className="navItem_profile">
              <Link href="/" className="navLink">Mi Perfil</Link>
            </div>
        </nav>
      );

};

export default Navbar;
