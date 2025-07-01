import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
function Home() {
  return (
    <section className="hero d-flex align-items-center">
      <div className="container text-start text-white"> 
        <h1 className="display-4 fw-bold">Join the Giving Circle</h1>
        <p className="lead mt-3">
          CircleAid Connect helps you give and receive — books, blood, clothes, and care.
        </p>
        <Link to="/register" className="btn btn-lg btn-gradient mt-4">Get Started</Link>
      </div>
    </section>
  );
}

export default Home;
