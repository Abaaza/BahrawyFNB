import React from 'react';

function Header({ onNavigate }) {
  return (
    <header>
      <a href="#main" className="skip-link">Skip to Main Content</a>
      <img src="https://via.placeholder.com/120x40?text=Treated+Web" alt="Treated Web" />
      <nav>
        <ul>
          <li><a href="#" onClick={() => onNavigate('Home')}>Home</a></li>
          <li><a href="#" onClick={() => onNavigate('About')}>About Us</a></li>
          <li><a href="#" onClick={() => onNavigate('Services')}>Services</a></li>
          <li><a href="#" onClick={() => onNavigate('Contact')}>Contact</a></li>
          <li><button onClick={() => onNavigate('Home')}>Get Started</button></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;