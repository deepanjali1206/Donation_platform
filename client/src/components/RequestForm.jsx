import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RequestForm.css'; 

const RequestForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    urgency: '',
    contact: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Request submitted successfully!');
        navigate('/my-requests');
      } else {
        alert(data.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error(error);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">🆘 Request Help</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Need Blood Group A+"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain the need clearly..."
              rows="3"
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Blood">Blood</option>
              <option value="Food">Food</option>
              <option value="Clothes">Clothes</option>
              <option value="Books">Books</option>
              <option value="Other">Other</option>
            </select>
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
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Contact Info</label>
            <input
              type="text"
              name="contact"
              className="form-control"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Phone, Email or Address"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
