import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaQrcode, FaCheckCircle, FaTimes } from 'react-icons/fa';

const API_BASE_URL = 'https://knowledge-zenith-earth.onrender.com';

// ==========================================
// DATA SECTION
// ==========================================
const programsData = [
  {
    title: "3 Hours Manifestation Webinar",
    subtitle: "Understand Fundamentals Of Manifestation",
    price: "Free",
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
    imageUrl: "/the_magic.jpg"
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
    const storedUser = localStorage.getItem('loggedInUser');

    if (!storedUser) {
      alert("⚠️ Please Login or Sign Up first to enroll in a program!");
      return;
    }

    setUserData(JSON.parse(storedUser));
    setSelectedCourse(course);
    setSuccessMessage('');
    setTransactionId('');
  };

  // 🌟 NAYA FUNCTION: Modal band karne ke liye
  const handleCloseModal = () => {
    setSelectedCourse(null);
    setSuccessMessage('');
    setTransactionId('');
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    const isFree = selectedCourse.price.toLowerCase() === 'free';

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
          handleCloseModal(); // 🌟 Automatically modal band
        }, 4000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Server error. Check your internet connection.");
    }
    setLoading(false);
  };

  return (
    <section className="py-16 md:py-20 px-4 md:px-6 bg-gray-50 overflow-hidden" id="programs">
      <div className="max-w-7xl mx-auto">

        {/* 🌟 FIX: Main Heading (Our Programs) Bada aur Bold, Subheading chhota */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 uppercase tracking-tight mb-3">Our Programs</h2>
          <h3 className="text-lg md:text-xl font-semibold text-blue-600">Transformative Journeys to Change Your Life</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10">
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

              <div className="w-full h-48 md:h-56 overflow-hidden bg-gray-200">
                <img
                  src={prog.imageUrl}
                  alt={prog.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{prog.title}</h4>
                <p className="text-blue-600 font-semibold mb-3">{prog.subtitle}</p>
                <p className="text-gray-600 text-sm md:text-base mb-5 italic leading-relaxed">"{prog.desc}"</p>

                <div className="mb-6 flex-grow">
                  <ul className="space-y-2">
                    {prog.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-700 text-sm md:text-base">
                        <span className="text-green-500 mr-2 font-bold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleBuyClick(prog)}
                  className="mt-auto bg-gray-900 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors w-full text-center shadow-md hover:shadow-lg"
                >
                  {prog.btnText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* 🌟 RESPONSIVE SMART MODAL (Fix for Mobile/Tabs) */}
      {/* ========================================== */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            // 🌟 FIX: max-h-[90vh] ensures it never goes out of screen
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative flex flex-col max-h-[90vh]"
          >
            {/* 🌟 FIX: Always visible cross button on Top Right */}
            <button 
              onClick={handleCloseModal} 
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-full p-2 z-10 transition-colors"
            >
              <FaTimes size={18} />
            </button>

            {/* 🌟 FIX: Modal internally scrollable if content is long */}
            <div className="p-6 md:p-8 overflow-y-auto">
              
              {successMessage ? (
                <div className="text-center py-8">
                  <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Registration Submitted!</h3>
                  <p className="text-gray-600">{successMessage}</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-1 pr-8">Enroll: {selectedCourse.title}</h2>
                  <p className="text-gray-500 text-xs md:text-sm mb-5">
                    {selectedCourse.price.toLowerCase() === 'free'
                      ? "Confirm your details below to register for free."
                      : "Complete your payment to secure your seat."}
                  </p>

                  {/* User Info (Compact) */}
                  <div className="bg-gray-50 p-3 md:p-4 rounded-xl mb-5 border border-gray-100">
                    <p className="text-xs md:text-sm text-gray-800 font-bold mb-1">Name: <span className="font-normal">{userData?.name}</span></p>
                    <p className="text-xs md:text-sm text-gray-800 font-bold mb-2">Email: <span className="font-normal">{userData?.email}</span></p>
                    <div className="border-t border-gray-200 pt-2">
                      <p className="text-sm text-gray-800 font-bold">Amount to Pay:
                        <span className={`font-black text-lg ml-2 ${selectedCourse.price.toLowerCase() === 'free' ? 'text-blue-600' : 'text-green-600'}`}>
                          {selectedCourse.price}
                        </span>
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitPayment}>
                    {selectedCourse.price.toLowerCase() !== 'free' && (
                      <>
                        <div className="text-center mb-5">
                          <p className="text-xs md:text-sm font-bold text-gray-600 mb-2 flex items-center justify-center gap-2">
                            <FaQrcode /> Scan to Pay
                          </p>
                          {/* 🌟 FIX: Vercel ke liye sahi image path ('/QR.jpeg') */}
                          <img
                            src="/QR.jpeg"
                            alt="Payment QR"
                            className="w-32 h-32 md:w-36 md:h-36 mx-auto border-4 border-gray-100 shadow-sm rounded-lg"
                          />
                          <p className="mt-2 text-xs md:text-sm text-gray-600 font-mono bg-gray-100 py-1 inline-block px-3 rounded-full border border-gray-200">
                            UPI:8120803877@ptsbi
                          </p>
                        </div>

                        <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">12-Digit Transaction / UTR ID</label>
                        <input
                          type="text"
                          required
                          maxLength="12"
                          placeholder="e.g. 312456789012"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-5 font-mono text-center tracking-widest bg-gray-50 text-sm md:text-base"
                        />
                      </>
                    )}

                    <button
                      type="submit"
                      disabled={loading || (selectedCourse.price.toLowerCase() !== 'free' && transactionId.length < 12)}
                      className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition disabled:bg-gray-400 text-sm md:text-base"
                    >
                      {loading ? 'Processing...' : (selectedCourse.price.toLowerCase() === 'free' ? 'Confirm Registration' : 'Submit Payment Details')}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Programs;