
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const Badge = ({ level, onClick }) => {
  const badges = {
    Bronze: { emoji: "🥉", color: "#cd7f32" },
    Silver: { emoji: "🥈", color: "#C0C0C0" },
    Gold: { emoji: "🥇", color: "#FFD700" },
    Platinum: { emoji: "🏆", color: "#0066cc" },
    Diamond: { emoji: "💎", color: "#8e2de2" },
  };

  const badge = badges[level] || { emoji: "🎖", color: "#000" };

  return (
    <span
      style={{
        fontSize: "1.2rem",
        marginLeft: "0.5rem",
        color: badge.color,
        cursor: "pointer",
      }}
      title={`${level} Donor`}
      onClick={onClick}
    >
      {badge.emoji}
    </span>
  );
};

function Navbar({ user, onLogout }) {
  const [credits, setCredits] = useState({ earned: 0, pending: 0 });
  const [level, setLevel] = useState(null);
  const navigate = useNavigate();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchCredits = useCallback(async () => {
    if (!token || !user) return;

    try {
      const res = await axios.get(`${API_BASE}/api/users/me/credits`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const earned = res.data?.earned || 0;
      const pending = res.data?.pending || 0;

      setCredits({ earned, pending });

      if (earned >= 1001) setLevel("Diamond");
      else if (earned >= 601) setLevel("Platinum");
      else if (earned >= 301) setLevel("Gold");
      else if (earned >= 101) setLevel("Silver");
      else if (earned >= 0) setLevel("Bronze");
      else setLevel(null);
    } catch (err) {
      console.error(
        "❌ Error fetching navbar credits:",
        err.response?.data || err.message
      );
    }
  }, [user, token, API_BASE]);

  useEffect(() => {
    fetchCredits();

    const onFocus = () => fetchCredits();
    window.addEventListener("focus", onFocus);

    const interval = setInterval(fetchCredits, 30_000);

    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [fetchCredits]);

  return (
    <nav className="navbar navbar-light bg-light shadow-sm py-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
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
                className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center gap-2"
                type="button"
                id="userMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                👤 {user.name || "Profile"}
                {level && (
                  <Badge
                    level={level}
                    onClick={() => navigate("/credits")}
                  />
                )}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userMenu"
              >
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
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    onClick={onLogout}
                    className="dropdown-item text-danger"
                  >
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
