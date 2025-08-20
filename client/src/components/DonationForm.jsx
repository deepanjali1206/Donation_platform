import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./DonationForm.css";

const campaigns = [
  { id: 1, title: "Books for Rural Schools", category: "Books" },
  { id: 2, title: "Clothes for Winter", category: "Clothes" },
  { id: 3, title: "Food for Needy", category: "Food" },
];

export default function DonationForm() {
  const { id } = useParams();
  const cause = campaigns.find((c) => c.id === parseInt(id));

  const [form, setForm] = useState({
    title: cause ? cause.title : "",
    category: cause ? cause.category : "",
    donorName: "",
    donorEmail: "",
    amount: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (file) formData.append("file", file);

      await axios.post("http://localhost:5000/api/donations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("🎉 Donation submitted successfully!");
      setForm({
        title: cause ? cause.title : "",
        category: cause ? cause.category : "",
        donorName: "",
        donorEmail: "",
        amount: "",
      });
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit donation.");
    }
  };

  return (
    <div className="donation-container">
      <div className="donation-card">
        <h2 className="form-title">Donate to {form.title}</h2>
        <form onSubmit={handleSubmit}>

          {/* Cause Title */}
          <div className="mb-3">
            <label className="form-label">Cause Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              className="form-control"
              readOnly
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              className="form-control"
              readOnly
            />
          </div>

          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              name="donorName"
              value={form.donorName}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Your Email</label>
            <input
              type="email"
              name="donorEmail"
              value={form.donorEmail}
              onChange={handleChange}
              className="form-control"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Amount */}
          <div className="mb-3">
            <label className="form-label">Donation Amount ($)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter amount"
              required
            />
          </div>

          {/* File */}
          <div className="mb-3">
            <label className="form-label">Upload File (optional)</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
            />
            <p className="location-info">
              * You can attach receipt, proof, or extra info.
            </p>
          </div>

          <button type="submit" className="submit-btn">
            💝 Submit Donation
          </button>

          <div className="text-center mt-3">
            <Link to="/causes" className="back-link">
              ← Back to Causes
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
