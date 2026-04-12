import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaQrcode, FaCheckCircle, FaTimes } from 'react-icons/fa';

const API_BASE_URL = 'https://knowledge-zenith-earth.onrender.com';

// ==========================================
// DATA SECTION (3-Hour wala wapas add kar diya, aur "Free" mark kiya)
// ==========================================
const programsData = [
  {
    title: "3 Hours Manifestation Webinar",
    subtitle: "Understand Fundamentals Of Manifestation",
    price: "Free", // 🌟 ISKO FREE RAKHA HAI
    desc: "This Webinar is for people who want to know more about LOA & Manifestation. Shortlisted participants will get an opportunity to grab this transformative session.",
    features: [
      "Cover Basics of Law of Attraction",
      "The Science of Subconscious Programming",
      "Improve Your 4 Areas Of Life: Health, Relationships, Career & Money"
    ],
    btnText: "Register Now",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "30 Days The Magic Book Practice",
    subtitle: "Create Your Life Magical",
    price: "₹999",
    desc: "A transformative journey based on 'The Magic' book practices, targeting the key areas of relationships, health, career, and money. Attract positivity and self-development!",
    features: [
      "Create a Magic Board for 4 areas of your life",
      "Learn 7-minute visualization methods for your dreams",
      "Right ways of writing powerful affirmations",
      "Proper alignment of your thoughts in a positive direction"
    ],
    btnText: "Start Today",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "21 Day Jackpot Course",
    subtitle: "Unlock Your Inner Potential!",
    price: "₹1,499",
    desc: "Exclusively designed for individuals who have been dedicated participants of The Magic program for at least three months. (Applicable for Advance practitioners only).",
    features: [
      "Deep Soul Cleansing",
      "Harness Positive Feelings",
      "Manifest Your 7 Inner Most Desires Within 21 Days!"
    ],
    btnText: "Start Today",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "6 Month Mentorship Program",
    subtitle: "What You Will Achieve & Get:",
    price: "₹4,999",
    desc: "This is not just a mentorship program; it’s a life-changing journey where we guide you every step of the way toward achieving tremendous success.",
    features: [
      "24/7 Support: Always available to guide & motivate you",
      "Step-by-Step Transformation: Build your success blueprint",
      "Lifetime Access: To all tools, resources, and materials",
      "Discover Your Unique Value: Build a powerful personal brand"
    ],
    btnText: "Apply Now",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop"
  }
];

// ==========================================
// PROGRAMS UI COMPONENT
// ==========================================
const Programs = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleBuyClick = (course) => {
    // 🌟 SMART FIX: Button dabate hi live check karega
    const storedUser = localStorage.getItem('loggedInUser');

    if (!storedUser) {
      alert("⚠️ Please Login or Sign Up first to enroll in a program!");
      return;
    }

    // Agar logged in hai, toh data set kar do
    setUserData(JSON.parse(storedUser));
    setSelectedCourse(course);
    setSuccessMessage('');
    setTransactionId('');
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    // 🌟 SMART LOGIC: Check if course is free
    const isFree = selectedCourse.price.toLowerCase() === 'free';

    // Agar Paid hai, tabhi 12 digit zaroori hain
    if (!isFree && transactionId.length !== 12) {
      alert("Please enter a valid 12-digit Transaction ID.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        program: selectedCourse.title,
        // Agar Free hai toh database me 'FREE' jayega, warna Transaction ID
        transaction_id: isFree ? "FREE_ENROLLMENT" : transactionId
      };

      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccessMessage(`Success! You have registered for ${selectedCourse.title}. ${isFree ? 'You will receive an email shortly.' : 'Our team will verify the payment and contact you soon.'}`);
        setTimeout(() => {
          setSelectedCourse(null);
          setTransactionId('');
        }, 5000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Server error. Check your internet connection.");
    }
    setLoading(false);
  };

  return (
    <section className="py-20 px-6 bg-gray-50 overflow-hidden" id="programs">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Our Programs</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900">Transformative Journeys</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {programsData.map((prog, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden relative"
            >
              <div className={`absolute top-4 right-4 text-white font-extrabold px-4 py-1 rounded-full shadow-lg z-10 ${prog.price.toLowerCase() === 'free' ? 'bg-blue-600' : 'bg-green-500'}`}>
                {prog.price}
              </div>

              <div className="w-full h-56 overflow-hidden bg-gray-200">
                <img
                  src={prog.imageUrl}
                  alt={prog.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{prog.title}</h4>
                <p className="text-blue-600 font-semibold mb-4">{prog.subtitle}</p>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{prog.desc}"</p>

                <div className="mb-8 flex-grow">
                  <ul className="space-y-3">
                    {prog.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-700">
                        <span className="text-green-500 mr-2 font-bold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleBuyClick(prog)}
                  className="mt-auto bg-gray-900 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full text-center shadow-md hover:shadow-lg"
                >
                  {prog.btnText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* SMART MODAL (Free/Paid Check) */}
      {/* ========================================== */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
          >
            {!successMessage && (
              <button onClick={() => setSelectedCourse(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                <FaTimes size={24} />
              </button>
            )}

            {successMessage ? (
              <div className="p-10 text-center">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Registration Submitted!</h3>
                <p className="text-gray-600">{successMessage}</p>
              </div>
            ) : (
              <div className="p-8">
                <h2 className="text-xl font-bold text-blue-900 mb-2">Enroll: {selectedCourse.title}</h2>
                <p className="text-gray-500 text-sm mb-6">
                  {selectedCourse.price.toLowerCase() === 'free'
                    ? "Confirm your details below to register for free."
                    : "Complete your payment to secure your seat."}
                </p>

                {/* User Info (Auto-filled) */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                  <p className="text-sm text-gray-800 font-bold">Name: <span className="font-normal">{userData?.name}</span></p>
                  <p className="text-sm text-gray-800 font-bold">Email: <span className="font-normal">{userData?.email}</span></p>
                  <p className="text-sm text-gray-800 font-bold mt-2">Amount to Pay:
                    <span className={`font-extrabold text-lg ml-1 ${selectedCourse.price.toLowerCase() === 'free' ? 'text-blue-600' : 'text-green-600'}`}>
                      {selectedCourse.price}
                    </span>
                  </p>
                </div>

                <form onSubmit={handleSubmitPayment}>
                  {/* 🌟 AGAR PAID HAI TOH QR CODE AUR INPUT DIKHAO 🌟 */}
                  {selectedCourse.price.toLowerCase() !== 'free' && (
                    <>
                      <div className="text-center mb-6">
                        <p className="text-sm font-bold text-gray-600 mb-2 flex items-center justify-center gap-2">
                          <FaQrcode /> Scan to Pay
                        </p>
                        {/* 🔴 YAHAN APNA ASLI QR CODE IMAGE LINK DAALEIN 🔴 */}
                        <img
                          src="C:\Projects\Knowledge_Zenith_Earth\frontend\public\QR.jpeg"
                          alt="Payment QR"
                          className="w-40 h-40 mx-auto border-4 border-gray-100 shadow-sm rounded-lg"
                        />
                        {/* 🔴 YAHAN APNI ASLI UPI ID DAALEIN 🔴 */}
                        <p className="mt-3 text-sm text-gray-600 font-mono bg-gray-100 py-1 inline-block px-4 rounded-full border border-gray-200">
                          UPI:8120803877@ptsbi
                        </p>
                      </div>

                      <label className="block text-sm font-bold text-gray-700 mb-1">12-Digit Transaction / UTR ID</label>
                      <input
                        type="text"
                        required
                        maxLength="12"
                        placeholder="e.g. 312456789012"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4 font-mono text-center tracking-widest bg-gray-50"
                      />
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading || (selectedCourse.price.toLowerCase() !== 'free' && transactionId.length < 12)}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : (selectedCourse.price.toLowerCase() === 'free' ? 'Confirm Registration' : 'Submit Payment Details')}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Programs;