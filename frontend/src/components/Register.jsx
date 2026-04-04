import React, { useState } from 'react';
import { motion } from 'framer-motion';

// ==========================================
// CONFIGURATION (Live karne ke liye zaroori)
// ==========================================
// Live karte waqt yahan backend ka URL dalna hoga (Jaise: 'https://omkar-backend.onrender.com')
const API_BASE_URL = 'http://localhost:5000';

// Programs aur unki fees (Database)
const programPrices = {
  "3 Hours Manifestation Webinar": 499,
  "30 Days The Magic Book Practice": 2000,
  "21 Day Jackpot Course": 1500,
  "6 Month Mentorship Program": 5000
};

// ==========================================
// REGISTRATION & PAYMENT COMPONENT
// ==========================================
const Register = () => {
  // 1. Component States
  const [step, setStep] = useState(1); // Step 1: Form, Step 2: Payment Screen
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '3 Hours Manifestation Webinar',
    transaction_id: '' // UTR ya Reference Number ke liye
  });

  const [statusMessage, setStatusMessage] = useState('');

  // Form input change handle karna
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Form bharne ke baad Payment screen par jana
  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // Step 2: Payment aur UTR details Backend (Flask) ko bhejna
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Verifying and saving details...');

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatusMessage("✅ Payment Info Submitted Successfully! We will verify and contact you.");
        
        // 5 second baad form ko wapas naya (reset) kar dena
        setTimeout(() => {
          setStep(1);
          setFormData({ name: '', email: '', phone: '', program: '3 Hours Manifestation Webinar', transaction_id: '' });
          setStatusMessage('');
        }, 5000); 
      } else {
        setStatusMessage('❌ Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('❌ Failed to connect to the server. Is Flask running?');
    }
  };

  // Jo program select kiya hai, uski price nikalna
  const currentPrice = programPrices[formData.program];

  return (
    <section className="py-20 px-6 bg-blue-50" id="register">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl min-h-[500px]">

        {/* SECTION HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Enroll Now</h2>
          <h3 className="text-3xl font-extrabold text-gray-900">
            {step === 1 ? "Start Your Journey" : "Complete Your Payment"}
          </h3>
        </div>

        {/* ==========================================
            STEP 1: REGISTRATION FORM
        ========================================== */}
        {step === 1 && (
          <motion.form
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleNextStep}
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your name" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">WhatsApp Number</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="+91 9876543210" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Select Program</label>
              <select name="program" value={formData.program} onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="3 Hours Manifestation Webinar">3 Hours Manifestation Webinar</option>
                <option value="30 Days The Magic Book Practice">30 Days The Magic Book Practice</option>
                <option value="21 Day Jackpot Course">21 Day Jackpot Course</option>
                <option value="6 Month Mentorship Program">6 Month Mentorship Program</option>
              </select>
            </div>

            {/* Price Display Box */}
            <div className="bg-gray-50 border rounded-lg p-6 flex justify-between items-center">
              <span className="text-gray-700 font-medium">Program Fees:</span>
              <span className="text-3xl font-bold text-green-600">₹{currentPrice}</span>
            </div>

            <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 rounded-lg shadow-md transition text-lg">
              Proceed to Pay ₹{currentPrice}
            </button>
          </motion.form>
        )}

        {/* ==========================================
            STEP 2: SCAN & PAY SCREEN (QR Code)
        ========================================== */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="text-center space-y-6"
          >
            {/* QR Code Box */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 inline-block w-full max-w-sm mx-auto">
              <p className="text-gray-600 font-medium mb-2">Scan QR to pay for</p>
              <p className="text-lg font-bold text-blue-900 mb-4">{formData.program}</p>

              {/* Local Public Folder Image */}
              <img
                src="/my_QR.jpeg"
                alt="My UPI QR Code"
                className="w-48 h-48 mx-auto border-4 border-white shadow-sm rounded-lg mb-4 object-contain"
              />

              <p className="font-extrabold text-3xl text-green-600 mb-2">₹{currentPrice}</p>
              <p className="text-gray-500 font-medium">UPI ID: 81208038@ptsbi</p>
            </div>

            {/* UTR Submission Form */}
            <form onSubmit={handleFinalSubmit} className="max-w-sm mx-auto space-y-4">
              <div className="text-left">
                <label className="block text-gray-700 font-bold mb-2">Enter 12-Digit UTR / Ref No.</label>
                <input
                  type="text"
                  name="transaction_id"
                  required
                  value={formData.transaction_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 outline-none"
                  placeholder="e.g. 312345678901"
                />
                <p className="text-xs text-gray-500 mt-2">You can find this in your PhonePe/GPay history after payment.</p>
              </div>

              <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg shadow-md transition text-lg">
                Submit Payment Details
              </button>

              <button type="button" onClick={() => setStep(1)} className="w-full text-gray-500 hover:text-gray-800 font-medium py-2">
                ← Go Back & Edit Details
              </button>
            </form>
          </motion.div>
        )}

        {/* STATUS MESSAGE NOTIFICATION */}
        {statusMessage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mt-6 p-4 text-center font-bold rounded-lg bg-green-100 text-green-800 border border-green-200"
          >
            {statusMessage}
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default Register;