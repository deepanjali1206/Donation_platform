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
     
  <section
  className="hero"
  style={{
    backgroundImage: `url('https://plus.unsplash.com/premium_photo-1661962927450-d5f7c9267ca2?w=1200&auto=format&fit=crop&q=80')`,
  }}
>
  <div className="container text-white">
    <h1 className="display-4 fw-bold">Join the Giving Circle</h1>
    <p className="lead mt-3">
      CircleAid Connect helps you give and receive — books, blood, clothes, and care. A community of compassion is just one step away.
    </p>

  
    <div className="d-flex gap-3 mt-4">
      <Link to="/register" className="btn btn-lg btn-gradient">
        Get Started
      </Link>
      <Link to="/causes" className="btn btn-lg btn-gradient">
        Explore Causes
      </Link>
    </div>
  </div>
</section>

  
      <section
        className="about-section d-flex align-items-center"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1683140516842-74c378a43d76?w=1200&auto=format&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '500px',
          position: 'relative',
          padding: '60px 0',
        }}
      >
        <div
          className="container"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: '30px',
            borderRadius: '10px',
            color: '#fff',
          }}
        >
          <h2 className="section-title text-white">More Than Just Donations</h2>
          <p className="section-text">
            CircleAid was founded on a simple belief: <strong>no help should go unnoticed</strong>, and no need should go unmet.
          </p>
          <p className="section-text">
            Whether it’s a book gathering dust, a warm coat, or a lifesaving drop of blood — you have something valuable to offer.
            CircleAid connects people not just through needs, but through compassion, trust, and action.
          </p>
          <p className="section-text">
            Every item you share tells a story. Every life you touch becomes part of our growing circle.
          </p>
        </div>
      </section>

    
      <section
        className="section-light py-5"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1599585183326-87b1fff61c33?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fHdoYXQlMjB5b3UlMjBjYW4lMjBzaGFyZSUyMGRvbmF0ZXxlbnwwfHwwfHx8MA%3D%3D")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container">
          <h2 className="section-title text-white">What You Can Share</h2>
          <div className="row">
            {[
              {
                title: "Books",
                image: "https://cdn-icons-png.flaticon.com/512/2232/2232688.png",
                description: "Inspire others by donating novels, textbooks, or children's stories.",
              },
              {
                title: "Blood",
                image: "https://cdn-icons-png.flaticon.com/512/2871/2871439.png",
                description: "A single donation can save multiple lives in medical emergencies.",
              },
              {
                title: "Clothes",
                image: "https://cdn-icons-png.flaticon.com/512/892/892458.png",
                description: "Warm someone's heart and body by giving clean, wearable clothes.",
              },
              {
                title: "Support",
                image: "https://cdn-icons-png.flaticon.com/512/2950/2950651.png",
                description: "Offer your skills, time, or encouragement to those in emotional need.",
              },
            ].map((item, idx) => (
              <div key={idx} className="col-md-3 mb-4">
                <div className="card h-100 shadow-sm border-0 text-center">
                  <div className="card-body d-flex flex-column align-items-center">
                    <img src={item.image} alt={item.title} style={{ height: "64px" }} className="mb-3" />
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text text-muted">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

   
      <section
        className="how-it-works-section text-white"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1653750365234-c1c10a5bf1b4?w=1200&auto=format&fit=crop&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          padding: '60px 0',
          minHeight: '600px',
          zIndex: 1,
        }}
      >
        <div
          className="overlay"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            width: '100%',
            height: '100%',
          }}
        >
          <div className="container text-center py-5">
            <h2 className="mb-5 section-title">How It Works</h2>

            <div className="row mb-5">
              <h4 className="fw-bold text-white mb-4">Want to Give? Here’s How!</h4>
              <div className="row">
                {donorSteps.map((step, idx) => (
                  <div key={idx} className="col-md-3 mb-4">
                    <div className="step-box bg-white text-dark p-3 rounded shadow d-flex flex-column align-items-center">
                      <img src={step.img} alt={step.title} style={{ height: "64px" }} className="mb-3" />
                      <h5 className="fw-bold text-center">{step.title}</h5>
                      <p className="text-center">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <h4 className="fw-bold text-white mb-4">Need Help?</h4>
              <div className="row">
                {requesterSteps.map((step, idx) => (
                  <div key={idx} className="col-md-3 mb-4">
                    <div className="step-box bg-white text-dark p-3 rounded shadow d-flex flex-column align-items-center">
                      <img src={step.img} alt={step.title} style={{ height: "64px" }} className="mb-3" />
                      <h5 className="fw-bold text-center">{step.title}</h5>
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