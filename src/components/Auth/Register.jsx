
// client/src/components/Auth/Register.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { User, Mail, Lock, X } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [alert, setAlert] = useState(null);
  const { register, googleLogin, error, clearErrors, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    if (error) {
      setAlert(error);
      clearErrors();
    }
  }, [error, isAuthenticated, navigate, clearErrors]);

  const { name, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match');
    } else {
      const success = await register({
        name,
        email,
        password
      });
      if (success) {
        navigate('/');
      }
    }
  };

const handleGoogleSuccess = async (credentialResponse) => {
  const success = await googleLogin(credentialResponse);
  if (success) {
    navigate('/');
  }
};



  const handleGoogleFailure = (error) => {
    console.error('Google Sign In Error:', error);
    setAlert('Google sign in failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-500 hover:text-primary-600">
              sign in to your account
            </Link>
          </p>
        </div>

        {alert && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{alert}</span>
            <button 
              className="absolute top-0 bottom-0 right-0 px-4 py-3" 
              onClick={() => setAlert(null)}
            >
              <X size={18} />
            </button>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex items-center border border-gray-300 rounded-t-md px-3">
              <User size={18} className="text-gray-400 mr-2" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Full name"
                value={name}
                onChange={onChange}
              />
            </div>
            <div className="flex items-center border border-gray-300 px-3">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={onChange}
              />
            </div>
            <div className="flex items-center border border-gray-300 px-3">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength="6"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={onChange}
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-b-md px-3">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                id="password2"
                name="password2"
                type="password"
                autoComplete="new-password"
                required
                minLength="6"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Confirm password"
                value={password2}
                onChange={onChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sign up
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div>
          <GoogleLogin
              onSuccess={(credentialResponse) => {
              handleGoogleSuccess(credentialResponse);
              }}
              onError={() => {
              handleGoogleFailure();
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;