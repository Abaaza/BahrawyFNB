import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flex, Box, Image, Link } from '@chakra-ui/react';

function Header({ onNavigate }) {
  return (
    <Flex as="header" bg="teal.500" color="white" p={4} align="center" justify="space-between">
      <Link href="#main" className="skip-link sr-only focus:not-sr-only">
        Skip to Main Content
      </Link>
      <Image
        src="https://via.placeholder.com/120x40?text=Treated+Web"
        alt="Treated Web"
        h={10}
      />
      <nav>
        <Flex as="ul" gap={4} listStyleType="none">
          <Box as="li">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'border-b-2 font-semibold' : '')}
            >
              Home
            </NavLink>
          </Box>
          <Box as="li">
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'border-b-2 font-semibold' : '')}
            >
              About Us
            </NavLink>
          </Box>
          <Box as="li">
            <NavLink
              to="/services"
              className={({ isActive }) => (isActive ? 'border-b-2 font-semibold' : '')}
            >
              Services
            </NavLink>
          </Box>
          <Box as="li">
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? 'border-b-2 font-semibold' : '')}
            >
              Contact
            </NavLink>
          </Box>
          <Box as="li">
            <NavLink
              to="/projects"
              className={({ isActive }) => (isActive ? 'border-b-2 font-semibold' : '')}
            >
              Projects
            </NavLink>
          </Box>
          <Box as="li">
            <NavLink
              to="/portal"
              className={({ isActive }) => (isActive ? 'border-b-2 font-semibold' : '')}
            >
              Portal
            </NavLink>
          </Box>
          <Box as="li">
            <NavLink
              to="/booking"
              className={({ isActive }) => (isActive ? 'border-b-2 font-semibold' : '')}
            >
              Booking
            </NavLink>
          </Box>
          <Box as="li">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? 'border-b-2 font-semibold' : '')}
            >
              Dashboard
            </NavLink>
          </Box>
          <Box as="li">
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? 'border-b-2 font-semibold' : '')}
            >
              Login
            </NavLink>
          </Box>
          <Box as="li">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'border-b-2 font-semibold' : '')}
            >
              Get Started
            </NavLink>
          </Box>
        </Flex>
      </nav>
    </Flex>
  );
}

export default Header;
