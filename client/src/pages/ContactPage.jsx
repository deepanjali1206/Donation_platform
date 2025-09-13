// src/pages/ContactPage.jsx
import React, { useState, useEffect } from "react";
import api from "../lib/api"; // <-- adjust path if needed
import "./ContactPage.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [userLevel, setUserLevel] = useState("Bronze"); // default
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  // 🔹 Fetch user credits to determine their level
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchLevel = async () => {
      try {
        const res = await api.get("/api/users/me/credits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { earned } = res.data;

        // Match levels (same as in CreditsDashboard)
        if (earned >= 101 && earned <= 300) setUserLevel("Silver");
        else if (earned >= 301 && earned <= 600) setUserLevel("Gold");
        else if (earned >= 601 && earned <= 1000) setUserLevel("Platinum");
        else if (earned >= 1001) setUserLevel("Diamond");
        else setUserLevel("Bronze");
      } catch (err) {
        console.error("❌ Failed to fetch user level:", err);
      }
    };

    fetchLevel();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      // 🔹 Add priority flag if user is Silver+
      const payload = {
        ...formData,
        priority: ["Silver", "Gold", "Platinum", "Diamond"].includes(userLevel)
          ? "high"
          : "normal",
      };

      await api.post("/api/reports", payload);

      setStatus({ loading: false, success: "📬 Your message has been sent!", error: null });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Error sending contact message:", err);
      setStatus({ loading: false, success: null, error: "❌ Failed to send message. Please try again." });
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h2 className="contact-title">📫 Contact Us</h2>
        <p className="contact-subtitle">
          We'd love to hear from you!{" "}
          {["Silver", "Gold", "Platinum", "Diamond"].includes(userLevel) && (
            <span className="text-green-600 font-semibold">
              ✅ Priority Support Enabled
            </span>
          )}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="subject"
              className="form-control"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <textarea
              name="message"
              className="form-control"
              rows="4"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn submit-btn w-100" disabled={status.loading}>
            {status.loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status.success && <p className="text-success text-center mt-3">{status.success}</p>}
        {status.error && <p className="text-danger text-center mt-3">{status.error}</p>}

        <div className="contact-info mt-4">
          <p>
            <i className="bi bi-envelope-fill me-2"></i> support@example.com
          </p>
          <p>
            <i className="bi bi-telephone-fill me-2"></i> +91 98765 43210
          </p>
          <p>
            <i className="bi bi-geo-alt-fill me-2"></i> Mathura, Uttar Pradesh, India
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
