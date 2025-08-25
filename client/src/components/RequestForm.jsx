import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestForm.css";

const RequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requestType: "",
    item: "",
    urgency: "",
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
  });

  const [coordinates, setCoordinates] = useState([0, 0]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoordinates([pos.coords.longitude, pos.coords.latitude]),
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

                <div className="mb-3">
                  <label className="form-label">Hospital / Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Apollo Hospital, Delhi"
                    required
                  />
                </div>
              </>
            )}

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
