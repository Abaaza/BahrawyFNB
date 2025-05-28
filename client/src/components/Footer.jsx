import React from 'react';
import { Link } from 'react-router-dom';


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-nav">
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="newsletter">
        <div>Stay Up to Date</div>
        <input type="email" placeholder="Email*" />
        <button>Submit</button>
        <div>
          <label>
            <input type="checkbox" /> Yes, subscribe me to your newsletter.
          </label>
        </div>
      </div>
      <p>info@treatedds.com</p>
      <div>
        <a href="#">Facebook</a> | <a href="#">LinkedIn</a>
      </div>
      <p>© 2025 by Treated Digital Solutions, All rights reserved.</p>
    </footer>
  );
}

export default Footer;