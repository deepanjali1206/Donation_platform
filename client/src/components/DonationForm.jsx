import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DonationForm.css";

const campaigns = [
  { id: 1, title: "Books for Rural Schools", category: "Books" },
  { id: 2, title: "Clothes for Winter", category: "Clothes" },
  { id: 3, title: "Food for Needy", category: "Food" },
  { id: 4, title: "Blood Donation Drive", category: "Blood" },
];

export default function DonationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("circleUser"));
      if (u?.email) setCurrentUser(u);
    } catch {}
  }, []);

  const cause = campaigns.find((c) => c.id === parseInt(id, 10));

  const [form, setForm] = useState({
    title: cause ? cause.title : "",
    category: cause ? cause.category : "",
    donorName: "",
    donorEmail: "",
    amount: "",
    quantity: "",
    notes: "",
    donationType: cause?.category === "Blood" ? "blood" : "money",
    bloodGroup: "",
    date: "",
    location: "",
    transactionId: "", 
  });

  useEffect(() => {
    if (currentUser?.email) {
      setForm((f) => ({ ...f, donorEmail: currentUser.email }));
    }
  }, [currentUser]);

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const isLikelyTxnId = (v) => /^[A-Za-z0-9\-_.]{8,}$/.test(v?.trim() || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.donationType === "money") {
      if (!form.amount || Number(form.amount) <= 0) {
        alert("⚠️ Please enter a valid amount.");
        return;
      }
      if (!isLikelyTxnId(form.transactionId)) {
        alert("⚠️ Please enter a valid UPI Transaction / Reference ID.");
        return;
      }
    }

    if (form.donationType === "item") {
      if (!form.quantity || Number(form.quantity) <= 0) {
        alert("⚠️ Quantity must be greater than 0.");
        return;
      }
    }

    if (form.donationType === "blood") {
      if (!form.bloodGroup || !form.date || !form.location) {
        alert("⚠️ Please fill blood group, date and location.");
        return;
      }
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (file) formData.append("image", file);

      await axios.post("http://localhost:5000/api/donations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Donation submitted successfully!");
      navigate("/my-donations");
    } catch (err) {
      console.error("Donation error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "❌ Failed to submit donation.";
      alert(msg);
    }
  };

  return (
    <div className="donation-container">
      <div className="donation-card">
        <h2 className="form-title">Donate to {form.title}</h2>

        <form onSubmit={handleSubmit}>
      
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
              readOnly={Boolean(currentUser?.email)}
            />
          </div>

          {cause?.category !== "Blood" && (
            <div className="mb-3">
              <label className="form-label">Donation Type</label>
              <select
                name="donationType"
                value={form.donationType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="money">Money</option>
                <option value="item">Item (Books, Clothes, Food)</option>
              </select>
            </div>
          )}

          {form.donationType === "money" && (
            <>
              <div className="mb-3">
                <label className="form-label">Donation Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter amount"
                  min={1}
                  required
                />
              </div>

              <div className="mb-3 text-center">
                <p>📱 Scan this QR code to donate using UPI:</p>
                <img
                  src="/images/upi-qr.jpg"
                  alt="UPI QR Code"
                  style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: 12 }}
                />
                <p style={{ marginTop: 8 }}>
                  <b>UPI ID:</b> 9336273155@axl
                </p>
                <small>
                  After completing payment in your UPI app, enter the Transaction ID below.
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label">Transaction ID</label>
                <input
                  type="text"
                  name="transactionId"
                  value={form.transactionId}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter UPI Transaction / Reference ID"
                  required
                />
                <small className="text-muted">
                  Tip: You can find it in your UPI app’s payment history (Ref/Txn/UTR).
                </small>
              </div>
            </>
          )}

          {form.donationType === "item" && (
            <>
              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter number of items"
                  min={1}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Describe the items you want to donate"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Upload File (optional)</label>
                <input type="file" className="form-control" onChange={handleFileChange} />
              </div>
            </>
          )}

          {form.donationType === "blood" && (
            <>
              <div className="mb-3">
                <label className="form-label">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Preferred Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter donation location / nearest blood bank"
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="submit-btn">
            {form.donationType === "money" ? "✅ I Have Donated" : "💝 Submit Donation"}
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
