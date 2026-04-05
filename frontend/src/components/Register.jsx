import React, { useState } from 'react';
import { motion } from 'framer-motion';

// ==========================================
// CONFIGURATION (Live Backend URL)
// ==========================================
// Tip: URL ke aakhir mein '/' na lagayein
const API_BASE_URL = 'https://knowledge-zenith-earth.onrender.com';

const programPrices = {
  "3 Hours Manifestation Webinar": 499,
  "30 Days The Magic Book Practice": 2000,
  "21 Day Jackpot Course": 1500,
  "6 Month Mentorship Program": 5000
};

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '3 Hours Manifestation Webinar',
    transaction_id: '' 
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New: Loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('⌛ Connecting to secure server... Please wait.');

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage("✅ Success! Payment details saved. We will contact you soon.");
        
        // Form Reset logic
        setTimeout(() => {
          setStep(1);
          setFormData({ 
            name: '', email: '', phone: '', 
            program: '3 Hours Manifestation Webinar', transaction_id: '' 
          });
          setStatusMessage('');
          setIsLoading(false);
        }, 5000); 
      } else {
        setStatusMessage(`❌ Error: ${data.message || 'Submission failed'}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('❌ Server is waking up or Offline. Please try again in 1 minute.');
      setIsLoading(false);
    }
  };

  const currentPrice = programPrices[formData.program];

  return (
    <section className="py-20 px-6 bg-blue-50" id="register">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl min-h-[500px]">

        <div className="text-center mb-10">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Enroll Now</h2>
          <h3 className="text-3xl font-extrabold text-gray-900">
            {step === 1 ? "Start Your Journey" : "Complete Your Payment"}
          </h3>
        </div>

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
                {Object.keys(programPrices).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 border rounded-lg p-6 flex justify-between items-center">
              <span className="text-gray-700 font-medium">Program Fees:</span>
              <span className="text-3xl font-bold text-green-600">₹{currentPrice}</span>
            </div>

            <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 rounded-lg shadow-md transition text-lg">
              Proceed to Pay ₹{currentPrice}
            </button>
          </motion.form>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="text-center space-y-6"
          >
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 inline-block w-full max-w-sm mx-auto">
              <p className="text-gray-600 font-medium mb-2">Scan QR to pay for</p>
              <p className="text-lg font-bold text-blue-900 mb-4">{formData.program}</p>

              <img
                src="/my_QR.jpeg"
                alt="Payment QR Code"
                className="w-48 h-48 mx-auto border-4 border-white shadow-sm rounded-lg mb-4 object-contain"
              />

              <p className="font-extrabold text-3xl text-green-600 mb-2">₹{currentPrice}</p>
              <p className="text-gray-500 font-medium">UPI ID: 81208038@ptsbi</p>
            </div>

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
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full font-bold py-4 rounded-lg shadow-md transition text-lg ${isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600 text-white'}`}
              >
                {isLoading ? 'Processing...' : 'Submit Payment Details'}
              </button>

              {!isLoading && (
                <button type="button" onClick={() => setStep(1)} className="w-full text-gray-500 hover:text-gray-800 font-medium py-2">
                  ← Go Back & Edit Details
                </button>
              )}
            </form>
          </motion.div>
        )}

        {statusMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={`mt-6 p-4 text-center font-bold rounded-lg border ${statusMessage.includes('✅') ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}
          >
            {statusMessage}
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default Register;