import React from 'react';
import { Outlet } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function Layout() {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box as="main" id="main" flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  );
}

export default Layout;
