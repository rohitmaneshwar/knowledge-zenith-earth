import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEnvelope, FaLock, FaUser, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';

const API_BASE_URL = 'https://knowledge-zenith-earth.onrender.com';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [view, setView] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); 

  // 🌟 Naye States: Password dikhane/chhupane ke liye
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', 
    identifier: '', 
    new_password: '', confirm_password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  // Jab Modal band ho, toh state reset kar do (Taki aglibaar password hide hi rahe)
  const handleClose = () => {
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  // ==========================================
  // API CALLS (Backend Connection)
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok) {
        showMessage("✅ Login Successful!", "success");
        onLoginSuccess({ name: data.name, email: data.email }); 
        setTimeout(handleClose, 1500); 
      } else {
        showMessage(`❌ ${data.message}`, "error");
      }
    } catch (err) {
      showMessage("Server connection failed!", "error");
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name, email: formData.email, 
          phone: formData.phone, password: formData.password
        })
      });
      const data = await res.json();
      if (res.ok) {
        showMessage("✅ Account Created! Please Login.", "success");
        setView('login'); 
      } else {
        showMessage(`❌ ${data.message}`, "error");
      }
    } catch (err) {
      showMessage("Server connection failed!", "error");
    }
    setLoading(false);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: formData.identifier })
      });
      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, email: data.email }); 
        showMessage("✅ Account Found! Enter new password.", "success");
        setView('reset'); 
      } else {
        showMessage(`❌ ${data.message}`, "error");
      }
    } catch (err) {
      showMessage("Server connection failed!", "error");
    }
    setLoading(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      return showMessage("❌ Passwords do not match!", "error");
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, new_password: formData.new_password })
      });
      const data = await res.json();
      if (res.ok) {
        showMessage("✅ Password Changed Successfully! Please Login.", "success");
        setView('login');
      } else {
        showMessage(`❌ ${data.message}`, "error");
      }
    } catch (err) {
      showMessage("Server connection failed!", "error");
    }
    setLoading(false);
  };

  // ==========================================
  // UI RENDER
  // ==========================================
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} 
        className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
        
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl">
          <FaTimes />
        </button>

        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {view === 'login' && "Welcome Back"}
          {view === 'signup' && "Create an Account"}
          {view === 'forgot' && "Find Your Account"}
          {view === 'reset' && "Create New Password"}
        </h3>

        {message.text && (
          <div className={`mb-4 p-3 rounded text-sm font-bold text-center ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input type="email" name="email" required placeholder="Email Address" onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            {/* 🌟 Login Password + Eye Icon */}
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" required placeholder="Password" onChange={handleChange} 
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setView('forgot')} className="text-sm text-blue-600 hover:underline">Forgot Password?</button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors">
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account? <button type="button" onClick={() => setView('signup')} className="text-blue-600 font-bold hover:underline">Sign up</button>
            </p>
          </form>
        )}

        {/* 2. SIGN UP FORM */}
        {view === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input type="text" name="name" required placeholder="Full Name" onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input type="email" name="email" required placeholder="Email Address" onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="relative">
              <FaPhone className="absolute top-3 left-3 text-gray-400" />
              <input type="tel" name="phone" required placeholder="WhatsApp Number" onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            {/* 🌟 Signup Password + Eye Icon */}
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" required placeholder="Create Password" onChange={handleChange} 
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account? <button type="button" onClick={() => setView('login')} className="text-blue-600 font-bold hover:underline">Login here</button>
            </p>
          </form>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {view === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-sm text-gray-600 mb-4 text-center">Enter your registered Email or Phone Number to reset your password.</p>
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input type="text" name="identifier" required placeholder="Email or Phone Number" onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
              {loading ? 'Searching...' : 'Find Account'}
            </button>
            <button type="button" onClick={() => setView('login')} className="w-full mt-2 text-gray-500 hover:text-gray-800 text-sm font-bold">
              ← Back to Login
            </button>
          </form>
        )}

        {/* 4. RESET PASSWORD FORM */}
        {view === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <p className="text-sm text-green-600 font-bold mb-4 text-center">Account verified! Create a new password.</p>
            {/* 🌟 New Password + Eye Icon */}
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="new_password" required placeholder="New Password" onChange={handleChange} 
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* 🌟 Confirm Password + Eye Icon */}
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirm_password" required placeholder="Re-enter New Password" onChange={handleChange} 
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors">
              {loading ? 'Updating...' : 'Set New Password'}
            </button>
          </form>
        )}

      </motion.div>
    </div>
  );
};

export default AuthModal;