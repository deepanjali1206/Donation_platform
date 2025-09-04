// client/src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

function Navbar({ user, onLogout }) {
  const [credits, setCredits] = useState({ earned: 0, pending: 0 });

  useEffect(() => {
    const fetchCredits = async () => {
      const token = localStorage.getItem("token");
      if (!token || !user) return; // no need to fetch if user not logged in

      try {
        const res = await axios.get("/api/users/me/credits", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCredits({
          earned: res.data?.earned || 0,
          pending: res.data?.pending || 0,
        });
      } catch (err) {
        console.error("❌ Error fetching navbar credits:", err.response?.data || err.message);
      }
    };

    fetchCredits();
  }, [user]);

  return (
    <nav className="navbar navbar-light bg-light shadow-sm py-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Left Logo */}
        <div className="navbar-left">
          <Link className="navbar-brand fw-bold fs-4 text-primary" to="/">
            🌍 CircleAid
          </Link>
        </div>

        {/* Center Navigation */}
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

        {/* Right Section */}
        <div className="navbar-right d-flex align-items-center gap-3">
          {user && (
            <Link
              to="/credits"
              className="btn btn-sm btn-outline-success fw-bold"
              title="Click to view earned + pending credits in your dashboard"
              style={{ textDecoration: "none" }}
            >
              💰 {credits.earned} (+{credits.pending} pending)
            </Link>
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
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary btn-sm dropdown-toggle"
                type="button"
                id="userMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                👤 {user.name || "Profile"}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                <li>
                  <Link className="dropdown-item" to="/my-donations">
                    📦 My Donations
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/my-requests">
                    🙋 My Requests
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/credits">
                    💰 Credits Dashboard
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button onClick={onLogout} className="dropdown-item text-danger">
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
