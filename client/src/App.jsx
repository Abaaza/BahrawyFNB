import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const AboutUs = lazy(() => import('./pages/AboutUs.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const TreatmentPlanning = lazy(() => import('./pages/TreatmentPlanning.jsx'));
const MarketingServices = lazy(() => import('./pages/MarketingServices.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Portal = lazy(() => import('./pages/Portal.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));


function App() {

  return (
  <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="services" element={<Services />} />
          <Route path="treatment" element={<TreatmentPlanning />} />
          <Route path="marketing" element={<MarketingServices />} />
          <Route path="contact" element={<Contact />} />
          <Route path="portal" element={<Portal />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
         </Route>
      </Routes>
    </Suspense>
  );
}

export default App;