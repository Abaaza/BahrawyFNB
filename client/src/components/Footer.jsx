import React from 'react';
import { Link } from 'react-router-dom';


function Footer() {
  return (
     <footer className="bg-gray-800 text-white p-8 text-center">
      <div className="flex justify-center gap-4 mb-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/about" className="hover:underline">About Us</Link>
        <Link to="/services" className="hover:underline">Services</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
      </div>
      <div className="my-4">
        <div className="mb-2 font-semibold">Stay Up to Date</div>
        <input
          type="email"
          placeholder="Email*"
          className="p-2 rounded text-gray-800"
        />
        <button className="ml-2 bg-teal-500 text-white px-4 py-2 rounded">
          Submit
        </button>
        <div className="mt-2 text-sm">
          <label className="inline-flex items-center">
            <input type="checkbox" className="mr-1" /> Yes, subscribe me to your
            newsletter.
          </label>
        </div>
      </div>
      <p className="mt-4">info@treatedds.com</p>
      <div className="mt-2">
        <a href="#" className="hover:underline">Facebook</a> |{' '}
        <a href="#" className="hover:underline">LinkedIn</a>
      </div>
      <p className="mt-4 text-sm">
        © 2025 by Treated Digital Solutions, All rights reserved.
      </p>
      </footer>
  );
}

export default Footer;