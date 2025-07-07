import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import HowItWorks from './HowItWorks';

function Home() {
  return (
    <>
    
      <section className="hero">
        <div className="container">
          <h1 className="display-4 fw-bold">Join the Giving Circle</h1>
          <p className="lead mt-3">
            CircleAid Connect helps you give and receive — books, blood, clothes, and care. A community of compassion is just one step away.
          </p>
          <Link to="/register" className="btn btn-lg btn-gradient mt-4">Get Started</Link>
        </div>
      </section>

    
      <section className="section-light">
        <div className="container">
          <h2 className="section-title">About CircleAid</h2>
          <p className="section-text">
            CircleAid is a social platform where generosity meets purpose. We enable people to share books, donate blood, exchange clothes, and offer support to those in need.
          </p>
        </div>
      </section>

      <section className="section-colored">
        <div className="container">
          <h2 className="section-title text-white">What You Can Share</h2>
          <div className="row text-center text-white mt-4">
            <div className="col-md-3 mb-3">
              <h5>📚 Books</h5>
              <p>Share knowledge and stories to inspire others.</p>
            </div>
            <div className="col-md-3 mb-3">
              <h5>🩸 Blood</h5>
              <p>Donate and save lives in critical moments.</p>
            </div>
            <div className="col-md-3 mb-3">
              <h5>👕 Clothes</h5>
              <p>Give unused clothing a new home.</p>
            </div>
            <div className="col-md-3 mb-3">
              <h5>❤️ Support</h5>
              <p>Offer emotional or material help to someone in need.</p>
            </div>
          </div>
        </div>
      </section>

  
    <HowItWorks />

    
      <section className="contact-section">
        <div className="container text-center text-white">
          <h2 className="mb-4">Get in Touch</h2>
          <p className="mb-0">
            Have questions or suggestions? Email us at{' '}
            <a href="mailto:support@circleaid.com" className="text-white fw-bold">support@circleaid.com</a>
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;
