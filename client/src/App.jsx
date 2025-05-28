import { useState } from 'react';
import './App.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
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
   <Header onNavigate={setCurrentPage} />
      <main id="main">

        <PageComponent />
      </main>
            <Footer />

    </>
  );
}

export default App;