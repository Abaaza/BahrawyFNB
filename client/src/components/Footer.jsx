import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-nav">
        <a href="#">Home</a>
        <a href="#">About Us</a>
        <a href="#">Services</a>
        <a href="#">Contact</a>
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