import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminNavbar.css";

function AdminNavbar() {
  return (
    <nav className="admin-navbar shadow-sm py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        
        <div className="navbar-left">
          <Link className="navbar-brand fs-5 fw-bold text-white" to="/admin/dashboard">
            CircleAid Admin
          </Link>
        </div>

    
        <div className="navbar-center d-none d-lg-flex">
          <ul className="navbar-nav flex-row gap-4">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/users">Users</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/ngos">NGOs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/requests">Requests</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/reports">Reports</Link>
            </li>
          </ul>
        </div>

        
        <div className="navbar-right d-flex gap-2">
          <Link to="/">
            <button className="btn btn-outline-light btn-sm">Back to Site</button>
          </Link>
          <Link to="/">
            <button className="btn btn-danger btn-sm">Logout</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
