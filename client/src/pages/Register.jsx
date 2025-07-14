import React, { useState } from 'react';
import './Login.css'; 
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Donor',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registered successfully!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        navigate('/'); 
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <section className="gradient-form" style={{ backgroundColor: '#eee', height: '100vh' }}>
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-md-10 col-lg-10">
            <div className="card text-black" style={{ borderRadius: '1rem', height: '100%' }}>
              <div className="row h-100 g-0">
                <div className="col-md-6 d-flex align-items-center">
                  <div className="card-body p-md-5 mx-md-4 w-100">
                    <div className="text-center">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                        style={{ width: '185px' }}
                        alt="logo"
                      />
                      <h4 className="mt-1 mb-5 pb-1">
                        Join the Giving Circle - <b>CircleAid Connect</b>
                      </h4>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <p><b>Create your Account</b></p>

                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter your Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <select
                          name="role"
                          className="form-select"
                          value={formData.role}
                          onChange={handleChange}
                        >
                          <option value="Donor">Donor</option>
                          <option value="Receiver">Receiver</option>
                          <option value="NGO">NGO</option>
                        </select>
                      </div>

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button className="btn btn-primary btn-block gradient-custom-2 mb-3" type="submit">
                          Register
                        </button>
                      </div>
                    </form>

                    <div className="d-flex align-items-center justify-content-center pb-4">
                      <p className="mb-0 me-2">Already have an account?</p>
                      <button type="button" className="btn btn-outline-primary" onClick={() => navigate('/Login')}>
                        Login
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 d-flex align-items-center gradient-custom-2 text-white">
                  <div className="px-3 py-4 p-md-5 mx-md-4">
                    <h4 className="mb-4">Be the reason someone smiles today</h4>
                    <p className="small mb-0">
                      CircleAid Connect enables you to easily contribute or request resources like
                      books, blood, clothes, and more. With every action, you help build a stronger,
                      more compassionate community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
