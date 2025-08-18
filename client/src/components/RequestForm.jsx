import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestForm.css";

const RequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item: "",
    urgency: "",
    quantity: "",
    isNGO: false,
  });
  const [coordinates, setCoordinates] = useState([0, 0]); // [lng, lat]

  // Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoordinates([pos.coords.longitude, pos.coords.latitude]),
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      quantity: parseInt(formData.quantity) || 1,
      coordinates,
    };

    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Response is not JSON:", text);
        throw new Error("Server returned invalid response");
      }

      if (res.ok) {
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

  return (
    <div className="request-wrapper">
      <div className="request-container">
        <div className="request-card shadow">
          <h2 className="text-center mb-4">Submit Help Request</h2>
          <form onSubmit={handleSubmit}>
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
