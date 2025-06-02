import React from 'react';
import { NavLink } from 'react-router-dom';

function Header({ onNavigate }) {
  return (
    <header className="bg-teal-500 text-white p-4 flex items-center justify-between">
      <a href="#main" className="skip-link sr-only focus:not-sr-only">Skip to Main Content</a>
      <img
        src="https://via.placeholder.com/120x40?text=Treated+Web"
        alt="Treated Web"
        className="h-10"
      />
      <nav>
        <ul className="flex gap-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? 'border-b-2 font-semibold' : ''} hover:text-gray-200`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${isActive ? 'border-b-2 font-semibold' : ''} hover:text-gray-200`
              }
            >
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `${isActive ? 'border-b-2 font-semibold' : ''} hover:text-gray-200`
              }
            >
              Services
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${isActive ? 'border-b-2 font-semibold' : ''} hover:text-gray-200`
              }
            >
              Contact
            </NavLink>
          </li>
                    <li>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `${isActive ? 'border-b-2 font-semibold' : ''} hover:text-gray-200`
              }
            >
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/portal"
              className={({ isActive }) =>
                `${isActive ? 'border-b-2 font-semibold' : ''} hover:text-gray-200`
              }
            >
              Portal
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${isActive ? 'border-b-2 font-semibold' : ''} hover:text-gray-200`
              }
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? 'border-b-2 font-semibold' : ''} hover:text-gray-200`
              }
            >
              Get Started
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
