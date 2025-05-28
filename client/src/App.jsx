import { useState } from 'react';
import './App.css';
import Home from './pages/Home.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Services from './pages/Services.jsx';
import TreatmentPlanning from './pages/TreatmentPlanning.jsx';
import MarketingServices from './pages/MarketingServices.jsx';
import Contact from './pages/Contact.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('Home');

  let PageComponent;
  switch (currentPage) {
    case 'About':
      PageComponent = AboutUs;
      break;
    case 'Services':
      PageComponent = Services;
      break;
    case 'Treatment':
      PageComponent = TreatmentPlanning;
      break;
    case 'Marketing':
      PageComponent = MarketingServices;
      break;
    case 'Contact':
      PageComponent = Contact;
      break;
    default:
      PageComponent = Home;
  }

  return (
    <>
      <header>
        <img src="https://via.placeholder.com/120x40?text=Treated+Web" alt="Treated Web" />
        <nav>
          <ul>
            <li><a href="#" onClick={() => setCurrentPage('Home')}>Home</a></li>
            <li><a href="#" onClick={() => setCurrentPage('About')}>About Us</a></li>
            <li><a href="#" onClick={() => setCurrentPage('Services')}>Services</a></li>
            <li><a href="#" onClick={() => setCurrentPage('Treatment')}>Treatment Planning</a></li>
            <li><a href="#" onClick={() => setCurrentPage('Marketing')}>Marketing Services</a></li>
            <li><a href="#" onClick={() => setCurrentPage('Contact')}>Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <PageComponent />
      </main>
    </>
  );
}
