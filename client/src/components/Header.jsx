import React from 'react';
import { NavLink } from 'react-router-dom';


function Header({ onNavigate }) {
  return (
    <header>
      <a href="#main" className="skip-link">Skip to Main Content</a>
      <img src="https://via.placeholder.com/120x40?text=Treated+Web" alt="Treated Web" />
      <nav>
        <ul>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About Us</NavLink></li>
          <li><NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''}>Services</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
          <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Get Started</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;