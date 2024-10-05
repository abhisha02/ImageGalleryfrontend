import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Ensure you import Link if you're using it
import HeaderBar from './Header';
import FooterBar from './footer';
import customerlogin from './customerlogin.png'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login(formData));
      if (login.fulfilled.match(resultAction)) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else if (login.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload?.error || 'Login failed';
        toast.error(errorMessage);
        console.error('Login error:', resultAction.payload);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Unexpected error during login:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderBar />
      <div className="container py-5 flex-grow-1">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-12 col-md-8 col-lg-7 col-xl-6 mb-4 mb-md-0">
            <img src={customerlogin} className="img-fluid" alt="Phone" />
          </div>
          <div className="col-12 col-md-7 col-lg-5 col-xl-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="form-control form-control-lg"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control form-control-lg"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-dark btn-lg btn-block"
                style={{ width: '100%' }}
              >
                Sign in
              </button>
              <div className="mt-3 text-center">
                <Link to="/register" className="text-dark">
                  Register
                </Link>
              </div>
            </form>
            <div className="mt-3 text-center">
              <Link to="/forgotpassword-request" className="text-dark">
                Forgot Password
              </Link>
            </div>
          </div>
        </div>
      </div>
      <FooterBar/>
    </section>
  );
};

export default Login;
