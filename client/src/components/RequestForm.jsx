import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestForm.css";

const RequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requestType: "",
    item: "",
    urgency: "Low",
    quantity: "",
    isNGO: false,
    amount: "",
    notes: "",
    bloodGroup: "",
    date: "",
    location: "",
    title: "",
    category: "",
    requesterName: "",
    requesterEmail: "",
    requesterPhone: "",
    deliveryPreference: "",
    paymentMode: "credits",
    useCredits: 0,
  });

  const [coordinates, setCoordinates] = useState([0, 0]);
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoordinates([pos.coords.longitude, pos.coords.latitude]),
        (err) => console.error("Geolocation error:", err)
      );
    }
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  // Submit request to backend
  const submitRequest = async () => {
    try {
      const payload = {
        ...formData,
        category: formData.requestType,
        title:
          formData.requestType === "money"
            ? "Financial Assistance"
            : formData.requestType === "blood"
            ? "Blood Requirement"
            : formData.item || "General Request",
        quantity: parseInt(formData.quantity) || 1,
        coordinates,
      };

      const formDataToSend = new FormData();
      for (const key in payload) formDataToSend.append(key, payload[key]);
      if (attachment) formDataToSend.append("attachment", attachment);

      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        const user = JSON.parse(localStorage.getItem("circleUser"));
        if (data.updatedCredits !== undefined) {
          const updatedUser = { ...user, credits: data.updatedCredits };
          localStorage.setItem("circleUser", JSON.stringify(updatedUser));
        }
        alert("Request submitted successfully!");
        navigate("/my-requests");
      } else {
        alert(data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error(error);
      alert("Server error. Please try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("circleUser"));
    let requiredCredits = 0;
    if (formData.isNGO || formData.requestType === "blood" || formData.urgency === "High") {
      requiredCredits = 0;
    } else if (formData.paymentMode === "credits") {
      requiredCredits = 5;
    } else if (formData.paymentMode === "hybrid") {
      requiredCredits = Number(formData.useCredits) || 0;
    }

    if (user?.credits < requiredCredits) {
      alert(`You need at least ${requiredCredits} credits to submit this request`);
      return;
    }

    const isMoneyPayment =
      formData.paymentMode === "money" || formData.paymentMode === "hybrid";

    // Trigger Razorpay if payment required
    if (isMoneyPayment && Number(formData.amount) > 0) {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Razorpay key from .env
        amount: Number(formData.amount) * 100, // in paise
        currency: "INR",
        name: "Help Circle",
        description: "Request Payment",
        handler: async function (response) {
          // Payment successful, submit request
          await submitRequest();
        },
        prefill: {
          name: formData.requesterName,
          email: formData.requesterEmail,
          contact: formData.requesterPhone,
        },
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Credits only
      await submitRequest();
    }
  };

  return (
    <div className="request-wrapper">
      <div className="request-container">
        <div className="request-card shadow">
          <h2 className="text-center mb-4">Submit Help Request</h2>
          <form onSubmit={handleSubmit}>
            {/* Name, Email, Phone */}
            <div className="mb-3">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                name="requesterName"
                className="form-control"
                value={formData.requesterName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Your Email</label>
              <input
                type="email"
                name="requesterEmail"
                className="form-control"
                value={formData.requesterEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="requesterPhone"
                className="form-control"
                value={formData.requesterPhone}
                onChange={handleChange}
                placeholder="e.g., +91 9876543210"
                required
              />
            </div>

            {/* Request Type */}
            <div className="mb-3">
              <label className="form-label">Request Type</label>
              <select
                name="requestType"
                className="form-select"
                value={formData.requestType}
                onChange={handleChange}
                required
              >
                <option value="">Select Request Type</option>
                <option value="money">Money</option>
                <option value="item">Item</option>
                <option value="blood">Blood</option>
              </select>
            </div>

            {/* Conditional Fields */}
            {formData.requestType === "item" && (
              <>
                <div className="mb-3">
                  <label className="form-label">Item Needed</label>
                  <input
                    type="text"
                    name="item"
                    className="form-control"
                    value={formData.item}
                    onChange={handleChange}
                    placeholder="e.g., Blankets, Food Packets"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Urgency</label>
                  <select
                    name="urgency"
                    className="form-select"
                    value={formData.urgency}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select urgency level</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </>
            )}

            {formData.requestType === "money" && (
              <>
                <div className="mb-3">
                  <label className="form-label">Amount Needed (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    value={formData.amount}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Purpose / Notes</label>
                  <textarea
                    name="notes"
                    className="form-control"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Why do you need this support?"
                  ></textarea>
                </div>
              </>
            )}

            {formData.requestType === "blood" && (
              <>
                <div className="mb-3">
                  <label className="form-label">Blood Group</label>
                  <select
                    name="bloodGroup"
                    className="form-select"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Blood Group</option>
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
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {/* Location & Delivery */}
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Apollo Hospital, Delhi or Home Address"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Delivery Preference</label>
              <select
                name="deliveryPreference"
                className="form-select"
                value={formData.deliveryPreference}
                onChange={handleChange}
                required
              >
                <option value="">Select Preference</option>
                <option value="pickup">I can pick up</option>
                <option value="delivery">Need delivery at given location</option>
              </select>
            </div>

            {/* NGO & Attachments */}
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                name="isNGO"
                className="form-check-input"
                checked={formData.isNGO}
                onChange={handleChange}
              />
              <label className="form-check-label">Requesting as an NGO</label>
            </div>
            <div className="mb-3">
              <label className="form-label">Upload Document (optional)</label>
              <input
                type="file"
                name="attachment"
                className="form-control"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </div>

            {/* Payment Mode */}
            <div className="mb-3">
              <label className="form-label">Payment Mode</label>
              <select
                name="paymentMode"
                className="form-select"
                value={formData.paymentMode}
                onChange={handleChange}
              >
                <option value="credits">Use Credits</option>
                <option value="money">Pure Money</option>
                <option value="hybrid">Hybrid (Money + Credits)</option>
              </select>
            </div>
            {formData.paymentMode === "hybrid" && (
              <div className="mb-3">
                <label className="form-label">Credits to Use</label>
                <input
                  type="number"
                  name="useCredits"
                  className="form-control"
                  value={formData.useCredits}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
