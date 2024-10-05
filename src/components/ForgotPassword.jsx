import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      toast.success('Password reset email sent. Please check your inbox.');
      setIsSent(true);
    } catch (error) {
      toast.error('Failed to send reset email: ' + error);
    }
  };

  if (isSent) {
    return (
      <div className="container d-flex align-items-center justify-content-center vh-100">
        <div className="card shadow-lg" style={{maxWidth: '400px'}}>
          <div className="card-body text-center p-5">
            <h2 className="card-title mb-4 fw-bold">Check Your Email</h2>
            <p className="card-text mb-4">
              We've sent a password reset link to <span className="fw-bold text-primary">{email}</span>. Please check your inbox and follow the instructions to reset your password.
            </p>
            <Link to="/" className="btn btn-outline-primary">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg" style={{maxWidth: '400px'}}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4 fw-bold">Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
              >
                Send Reset Email
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Link to="/" className="text-decoration-none">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;