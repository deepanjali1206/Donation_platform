import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate=useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Successfully');
  };

  return (
    <section className="h-100 gradient-form" style={{ backgroundColor: '#eee' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
             
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4">

                    <div className="text-center">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                        style={{ width: '185px' }}
                        alt="logo"
                      />
                      <h4 className="mt-1 mb-5 pb-1">Connecting Needs With Kindness -<b>CircleAid Connect</b></h4>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <p><b>Please login to your account</b></p>

                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="form2Example11"
                          className="form-control"
                          placeholder="Username"
                          required
                        />
                        <label className="form-label" htmlFor="form2Example11"></label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="form2Example22"
                          className="form-control"
                          placeholder='Password'
                          required
                        />
                        <label className="form-label" htmlFor="form2Example22"></label>
                      </div>

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button
                          className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                          type="submit"
                        >
                          Log in
                        </button>
                        <a className="text-muted" href="#!">Forgot password?</a>
                      </div>

                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">Don't have an account?</p>
                        <button type="button" className="btn btn-outline-danger" onClick={()=>navigate('/Register')}>Create new </button>
                      </div>
                    </form>

                  </div>
                </div>

              
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4 className="mb-4">A Smarter Way to Give & Recieve</h4>
                    <p className="small mb-3">
                   CircleAid Connect empowers communities with intelligent tools to donate or request resources. 
                    Through map-based matching and a gamified reward system, we’re building a future where giving is easy, transparent, and impactful
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

export default Login;
