import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('📬 Your message has been sent!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h2 className="contact-title">📫 Contact Us</h2>
        <p className="contact-subtitle">We'd love to hear from you!</p>

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

          <button type="submit" className="btn submit-btn w-100">
            Send Message
          </button>
        </form>

        <div className="contact-info mt-4">
          <p><i className="bi bi-envelope-fill me-2"></i> support@example.com</p>
          <p><i className="bi bi-telephone-fill me-2"></i> +91 98765 43210</p>
          <p><i className="bi bi-geo-alt-fill me-2"></i> Mathura, Uttar Pradesh, India</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;