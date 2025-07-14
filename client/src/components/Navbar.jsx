import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

function Navbar({ user }) {
  return (
    <nav className="navbar navbar-light bg-light shadow-sm py-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Left - Logo */}
        <div className="navbar-left">
          <Link className="navbar-brand fw-bold fs-4 text-primary" to="/">
            🌍 CircleAid
          </Link>
        </div>

      
        <div className="navbar-center d-none d-lg-flex">
          <ul className="navbar-nav flex-row gap-4">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
           
            <li className="nav-item">
              <Link className="nav-link" to="/donate">Donate</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/request">Request-Help</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
          </ul>
        </div>


        <div className="navbar-right d-flex align-items-center gap-3">
          {user && (
            <div className="text-success fw-bold">
              💰 {user.credits} Credits
            </div>
          )}
          
          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline-primary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          ) : (
            <Link to="/logout" className="btn btn-outline-danger btn-sm">
              Logout
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
