import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../features/auth/authSlice';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import registerimag from './registercustomer.avif'
import HeaderBar from './Header';
import FooterBar from './footer';


const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [formError, setFormError] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
    setIsLoading(true);

    dispatch(register(formData))
      .unwrap()
      .then(() => {
        
        toast.success('Registration successful!');
        navigate('/')
      })
      .catch((error) => {
        toast.error('Registration failed: ' + JSON.stringify(error));
      }).finally(() => {
        setIsLoading(false);
      });
  };
  {if(isLoading){
    return(<LoadingSpinner/>)
  }}




  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <HeaderBar/>
      <div className="container py-5 flex-grow-1">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-12 col-md-8 col-lg-7 col-xl-6 mb-4 mb-md-0">
            <img src={registerimag} className="img-fluid" alt="Register" />
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
                <label className="form-label" htmlFor="email">
                  Email address
                </label>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  className="form-control form-control-lg" 
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label" htmlFor="phone_number">
                  Phone number
                </label>
                <input 
                  type="tel" 
                  name="phone_number" 
                  id="phone_number" 
                  className="form-control form-control-lg" 
                  placeholder="Enter your phone number"
                  value={formData.phone_number}
                  onChange={handleChange}
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
              <div className="mb-4">
                <label className="form-label" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <input 
                  type="password" 
                  name="confirm-password" 
                  id="confirm-password" 
                  className="form-control form-control-lg" 
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {formError.length > 0 && (
                <div className="alert alert-danger" role="alert">
                  {formError.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
              <button 
                type="submit" 
                className="btn btn-dark btn-lg btn-block" 
                style={{ width: '100%' }}
              >
                Register
              </button>
              <div className="mt-3 text-center">
                <Link to="/" className="text-dark">
                  Already have an account? Login here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <FooterBar/>
    </section>
  );
};

export default Register;
