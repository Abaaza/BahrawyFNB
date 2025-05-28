import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const AboutUs = lazy(() => import('./pages/AboutUs.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const TreatmentPlanning = lazy(() => import('./pages/TreatmentPlanning.jsx'));
const MarketingServices = lazy(() => import('./pages/MarketingServices.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));

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
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;