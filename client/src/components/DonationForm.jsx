import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import './DonationForm.css';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const center = {
  lat: 27.4924,
  lng: 77.6737,
};

const DonationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBZM2npfRdT_M4Hfw7mwk3jkLgvWGzglRM',
  });

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBZM2npfRdT_M4Hfw7mwk3jkLgvWGzglRM`
      );
      const data = await res.json();
      if (data.status === 'OK') {
        setSelectedAddress(data.results[0].formatted_address);
      } else {
        setSelectedAddress('Address not found');
      }
    } catch (err) {
      console.error(err);
      setSelectedAddress('Error fetching address');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocation) return alert('Please select a location');

    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('description', formData.description);
    submissionData.append('category', formData.category);
    submissionData.append('latitude', selectedLocation.lat);
    submissionData.append('longitude', selectedLocation.lng);
    submissionData.append('address', selectedAddress);
    if (formData.image) submissionData.append('image', formData.image);

    try {
      const res = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: submissionData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('🎉 Donation submitted successfully!');
        navigate('/my-donations');
      } else {
        alert(data.message || 'Failed to submit donation');
      }
    } catch (error) {
      console.error(error);
      alert('Server error');
    }
  };

  return (
    <div className="donation-container">
      <div className="donation-card">
        <h2 className="form-title">✨ Share Kindness, Spark Change</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Warm Jackets"
              required
            />
          </div>

          <div className="mb-3">
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description..."
              rows="3"
              required
            />
          </div>

          <div className="mb-3">
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Clothes">Clothes</option>
              <option value="Books">Books</option>
              <option value="Food">Food</option>
              <option value="Blood">Blood</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="mb-3">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={10}
                center={center}
                onClick={(e) => {
                  const lat = e.latLng.lat();
                  const lng = e.latLng.lng();
                  setSelectedLocation({ lat, lng });
                  getAddressFromLatLng(lat, lng);
                }}
              >
                {selectedLocation && <Marker position={selectedLocation} />}
              </GoogleMap>
            ) : (
              <p>Loading map...</p>
            )}
          </div>

          {selectedLocation && (
            <div className="mb-3 text-muted">
              📍 <strong>Location:</strong> {selectedAddress || 'Fetching address...'}
            </div>
          )}

          <div className="mb-4">
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <button type="submit" className="btn submit-btn w-100">
            Submit Donation
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;