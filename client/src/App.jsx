import './App.css';

function App() {
  return (
    <>
      <header>
        <img src="https://via.placeholder.com/120x40?text=Treated+Web" alt="Treated Web" />
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Get Started</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <h1>Grow Smarter, Perform Better, Smile Wider</h1>
        <p>
          Digital solutions built for dental and healthcare clinics — lead
          generation, data management, web presence, and beyond.
        </p>
        <button>Get Started</button>
      </section>

      <section className="section">
        <h2>Let’s Build the Future of your Clinic Together.</h2>
        <p>
          Streamline your patient workflow with fast, accurate, and compliant
          data entry for Invisalign and iTero systems.
        </p>
        <h3>Treatment Plans</h3>
      </section>

      <section className="section">
        <p>
          Get more high-quality dental leads with targeted Google Ads and Meta
          (Facebook & Instagram) ad campaigns.
        </p>
        <h3>Paid Advertising</h3>
      </section>

      <section className="section">
        <p>
          Professional, patient-friendly websites that convert visitors into
          bookings — built to perform and represent your brand.
        </p>
        <h3>Web Design</h3>
      </section>

      <section className="section">
        <h3>More Services</h3>
        <ul>
          <li>Search Engine Optimization</li>
          <li>Social Media Marketing</li>
          <li>Branding & Print</li>
          <li>Video Production</li>
          <li>All Features</li>
        </ul>
      </section>

      <section className="section">
        <h2>Your Growth Partner in the Digital Space</h2>
        <p>
          At Treated Digital Solutions, we specialize in helping dental and
          healthcare clinics unlock their true potential online. We combine
          precision, creativity, and industry expertise to deliver marketing,
          web, and data solutions that truly make a difference.
        </p>
        <a href="#">Learn More</a>
      </section>

      <section className="section">
        <h2>Our Journey in Numbers</h2>
        <p>3+ Years of Experience</p>
        <p>20+ Trusted Clients</p>
        <p>75k+ Leads Generated</p>
      </section>

      <section className="section">
        <h2>Get All The Tools You Need At a Single Spot</h2>
        <button>Get Started</button>
      </section>

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
    </>
  );
}

export default App;