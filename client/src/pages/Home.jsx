import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const donorSteps = [
    {
      title: "CHOOSE A CAUSE",
      description: "Browse different campaigns and select a cause.",
      img: "https://cdn-icons-png.flaticon.com/512/833/833472.png",
    },
    {
      title: "FILL DONATION FORM",
      description: "Select items and quantity you wish to donate.",
      img: "https://cdn-icons-png.flaticon.com/512/891/891419.png",
    },
    {
      title: "ORDER PROCESSING",
      description: "Submit your donation and confirm checkout.",
      img: "https://cdn-icons-png.flaticon.com/512/1043/1043460.png",
    },
    {
      title: "DELIVERY REPORT",
      description: "We deliver the items and send you updates.",
      img: "https://cdn-icons-png.flaticon.com/512/3602/3602123.png",
    },
  ];

  const requesterSteps = [
    {
      title: "SUBMIT A REQUEST",
      description: "Fill out a form with the items or help you need.",
      img: "https://cdn-icons-png.flaticon.com/512/1828/1828919.png",
    },
    {
      title: "VERIFICATION",
      description: "Our team reviews and approves your request.",
      img: "https://cdn-icons-png.flaticon.com/512/992/992651.png",
    },
    {
      title: "MATCH WITH DONORS",
      description: "We connect your request with a matching donor.",
      img: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
    },
    {
      title: "RECEIVE SUPPORT",
      description: "Track delivery status and confirm receipt.",
      img: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
    },
  ];

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

     
      <section className="how-it-works py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-5"><span className="orange-bar" /> How It Works</h2>

          <div className="row mb-5">
            <div className="col-12">
              <h4 className="fw-bold text-primary mb-4">Want to Give? Here’s How!</h4>
              <div className="row">
                {donorSteps.map((step, idx) => (
                  <div className="col-md-3 mb-4" key={idx}>
                    <div className="step-box p-3 border rounded bg-white h-100 shadow-sm d-flex flex-column align-items-center justify-content-between">
                      <h5 className="fw-bold text-center">{step.title}</h5>
                      <img
                        src={step.img}
                        alt={step.title}
                        className="img-fluid my-3"
                        style={{ maxHeight: "80px" }}
                      />
                      <p className="text-center">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h4 className="fw-bold text-success mb-4">Need Help?</h4>
              <div className="row">
                {requesterSteps.map((step, idx) => (
                  <div className="col-md-3 mb-4" key={idx}>
                    <div className="step-box p-3 border rounded bg-white h-100 shadow-sm d-flex flex-column align-items-center justify-content-between">
                      <h5 className="fw-bold text-center">{step.title}</h5>
                      <img
                        src={step.img}
                        alt={step.title}
                        className="img-fluid my-3"
                        style={{ maxHeight: "80px" }}
                      />
                      <p className="text-center">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section bg-dark py-5">
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
