import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./DonationForm.css";

export default function DonationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(null);
  const [cause, setCause] = useState(location.state?.cause || null); // ✅ prefill if passed from CausePage
  const [form, setForm] = useState({
    title: location.state?.cause?.title || "",
    category: location.state?.cause?.category || "",
    donorName: "",
    donorEmail: "",
    amount: "",
    quantity: "",
    notes: "",
    donationType: location.state?.cause?.category || "money",
    bloodGroup: "",
    date: "",
    location: "",
  });
  const [file, setFile] = useState(null);

  // Load current user from localStorage
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("circleUser"));
      if (u?.email) setCurrentUser(u);
    } catch { }
  }, []);

  // Fetch the selected campaign from backend (only if not passed via state)
  useEffect(() => {
    if (!cause && id) {
      const fetchCause = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/campaigns/${id}`);
          setCause(res.data);
          setForm((f) => ({
            ...f,
            title: res.data.title,
            category: res.data.category,
            donationType: res.data.category || "money",
          }));
        } catch (err) {
          console.error("Error fetching cause:", err);
        }
      };
      fetchCause();
    }
  }, [id, cause]);

  // Autofill donor email if logged in
  useEffect(() => {
    if (currentUser?.email) {
      setForm((f) => ({ ...f, donorEmail: currentUser.email }));
    }
  }, [currentUser]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  // Razorpay payment handler
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      const { data: order } = await axios.post(
        "http://localhost:5000/api/payments/create-order",
        { amount: form.amount }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "GiveHope",
        description: `Donation for ${form.title || "General Donation"}`,
        order_id: order.id,
        handler: async function (response) {
          const formData = new FormData();
          Object.entries(form).forEach(([k, v]) => formData.append(k, v));
          formData.append("razorpayPaymentId", response.razorpay_payment_id);
          formData.append("razorpayOrderId", response.razorpay_order_id);
          formData.append("razorpaySignature", response.razorpay_signature);
          if (file) formData.append("image", file);

          const token = localStorage.getItem("token");
          if (!token) {
            alert("Please login to donate.");
            return;
          }

          const res = await axios.post("http://localhost:5000/api/donations", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

          // ✅ update credits in UI
          if (res.data?.updatedCredits) {
            const updatedUser = { ...currentUser, credits: res.data.updatedCredits };
            setCurrentUser(updatedUser);
            localStorage.setItem("circleUser", JSON.stringify(updatedUser));
          }

          alert("✅ Donation successful!");
          navigate("/my-donations");

        },
        prefill: {
          name: form.donorName,
          email: form.donorEmail,
        },
        theme: { color: "#9b87f5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Razorpay error:", err.response?.data || err.message);
      alert("Payment failed. Try again!");
    }
  };

  // Form submission for non-money donations
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.donationType !== "money") {
      if (form.donationType === "item" && (!form.quantity || Number(form.quantity) <= 0)) {
        alert("Quantity must be greater than 0.");
        return;
      }

      if (form.donationType === "blood" && (!form.bloodGroup || !form.date || !form.location)) {
        alert("Please fill blood group, date, and location.");
        return;
      }

      try {
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        if (file) formData.append("image", file);

        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login to donate.");
          return;
        }

        const res = await axios.post("http://localhost:5000/api/donations", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ update credits in UI
        if (res.data?.updatedCredits) {
          const updatedUser = { ...currentUser, credits: res.data.updatedCredits };
          setCurrentUser(updatedUser);
          localStorage.setItem("circleUser", JSON.stringify(updatedUser));
        }

        alert("✅ Donation submitted successfully!");
        navigate("/my-donations");

      } catch (err) {
        console.error("❌ Donation error:", err.response?.data || err.message);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "❌ Failed to submit donation.";
        alert(msg);
      }
    }
  };

  // ✅ fallback title if no campaign
  const campaignTitle = form.title || "General Donation";

  return (
    <div className="donation-container">
      <div className="donation-card">
        <h2 className="form-title">Donate to {campaignTitle}</h2>

        <form>
          {/* donor info */}
          <div className="mb-3">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              name="donorName"
              value={form.donorName}
              onChange={handleChange}
              className="form-control"
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
              required
              readOnly={Boolean(currentUser?.email)}
            />
          </div>

          {/* donation type */}
          {form.donationType !== "blood" && (
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
                <option value="blood">Blood</option>
              </select>
            </div>
          )}

          {/* money */}
          {form.donationType === "money" && (
            <div className="mb-3">
              <label className="form-label">Donation Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="form-control"
                min={1}
                required
              />
              <button className="submit-btn mt-3" onClick={handlePayment}>
                💳 Pay with Razorpay
              </button>
            </div>
          )}

          {/* item */}
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
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Upload File (optional)</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
              <button className="submit-btn" onClick={handleSubmit}>
                💝 Submit Donation
              </button>
            </>
          )}

          {/* blood */}
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
              <button className="submit-btn" onClick={handleSubmit}>
                💝 Submit Donation
              </button>
            </>
          )}

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
