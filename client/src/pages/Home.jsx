import React from 'react';
import { Box, Heading, Text, Button, Link } from '@chakra-ui/react';

function Home() {
  return (
    <>
      <Box as="section" bgGradient="linear(to-r, teal.500, cyan.400)" color="white" py={16} textAlign="center">
        <Heading as="h1" size="xl" mb={4}>
          Grow Smarter, Perform Better, Smile Wider
        </Heading>
        <Text maxW="xl" mx="auto" mb={6}>
          Digital solutions built for dental and healthcare clinics — lead generation, data management, web presence, and beyond.
        </Text>
        <Button bg="white" color="teal.600">Get Started</Button>
      </Box>

      <Box as="section" py={12} textAlign="center">
        <Heading as="h2" size="lg" mb={2}>
          Let’s Build the Future of your Clinic Together.
        </Heading>
        <Text maxW="xl" mx="auto" mb={4}>
          Streamline your patient workflow with fast, accurate, and compliant data entry for Invisalign and iTero systems.
        </Text>
        <Heading as="h3" size="md">Treatment Plan</Heading>
      </Box>

      <Box as="section" py={12} textAlign="center">
        <Text maxW="xl" mx="auto" mb={4}>
          Get more high-quality dental leads with targeted Google Ads and Meta (Facebook & Instagram) ad campaigns.
        </Text>
        <Heading as="h3" size="md">Paid Advertising</Heading>
      </Box>

      <Box as="section" py={12} textAlign="center">
        <Text maxW="xl" mx="auto" mb={4}>
          Professional, patient-friendly websites that convert visitors into bookings — built to perform and represent your brand.
        </Text>
        <Heading as="h3" size="md">Web Design</Heading>
      </Box>

      <Box as="section" py={12} textAlign="center">
        <Heading as="h3" size="md" mb={2}>
          More Services
        </Heading>
        <Box as="ul" listStyleType="none" lineHeight="1.8">
          <li>Search Engine Optimization</li>
          <li>Social Media Marketing</li>
          <li>Branding & Print</li>
          <li>Video Production</li>
          <li>All Features</li>
        </Box>
      </Box>

      <Box as="section" py={12} textAlign="center">
        <Heading as="h2" size="lg" mb={2}>
          Your Growth Partner in the Digital Space
        </Heading>
        <Text maxW="xl" mx="auto" mb={4}>
          At Treated Digital Solutions, we specialize in helping dental and healthcare clinics unlock their true potential online. We combine precision, creativity, and industry expertise to deliver marketing, web, and data solutions that truly make a difference.
        </Text>
        <Link href="#" color="teal.600" textDecor="underline">
          Learn More
        </Link>
      </Box>

      <Box as="section" py={12} textAlign="center">
        <Heading as="h2" size="lg" mb={2}>
          Our Journey in Numbers
        </Heading>
        <Text>3+ Years of Experience</Text>
        <Text>20+ Trusted Clients</Text>
        <Text>75k+ Leads Generated</Text>
      </Box>

      <Box as="section" py={12} textAlign="center">
        <Heading as="h2" size="lg" mb={4}>
          Get All The Tools You Need At a Single Spot
        </Heading>
        <Button bg="teal.500" color="white">Get Started</Button>
      </Box>
    </>
  );
}

export default Home;
