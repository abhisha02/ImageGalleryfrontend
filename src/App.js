import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Register from './components/Register';
import { LoadingSpinner } from './components/LoadingSpinner';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/dashboard';
import { checkAuthStatus } from './features/auth/authSlice'; 

const PrivateRoute = ({ children }) => {
  const { token, isLoading } = useSelector((state) => state.auth);
  
  if (isLoading) {
    return <LoadingSpinner/>;
  }
  
  return token ? children : <Navigate to="/" />;
};



function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  
  return (
    <Router>
      <div>
        <Toaster position="top-right" />
        <Routes>
        
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />}  />
        <Route path="/forgotpassword-request" element={<ForgotPassword/>} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
         
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
        </Routes>
       
      </div>
    </Router>
  );
}

export default App;