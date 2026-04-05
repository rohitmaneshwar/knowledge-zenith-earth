import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// ==========================================
// CONFIGURATION
// ==========================================
const API_BASE_URL = 'https://knowledge-zenith-earth.onrender.com';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // New: Submitting state

  const scrollRef = useRef(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  const [newReview, setNewReview] = useState({
    name: '',
    program: '3 Hours Manifestation Webinar',
    rating: 5,
    message: ''
  });

  // Database se Reviews Load karna
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/reviews`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftBtn(scrollLeft > 10);
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350; 
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Naya Review Submit karna
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Button ko disable karne ke liye

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        await fetchReviews(); 
        setShowForm(false);
        setNewReview({ name: '', program: '3 Hours Manifestation Webinar', rating: 5, message: '' });
        alert("✨ Magic Posted! Aapka feedback save ho gaya hai.");
      } else {
        alert("❌ Error: Server ne request accept nahi ki.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("⚠️ Server Error! Ya toh Render server 'Sleep' mode mein hai ya URL galat hai. Kripya 1 minute baad fir koshish karein.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  return (
    <section className="py-20 px-6 bg-white overflow-hidden" id="feedback">
      <div className="max-w-7xl mx-auto relative">
        
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Testimonials</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">Real Stories, Real Magic ✨</h3>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1"
          >
            + Share Your Experience
          </button>
        </div>

        <div className="relative group">
          {showLeftBtn && (
            <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white text-blue-900 p-4 rounded-full shadow-xl border border-gray-100 hover:bg-blue-600 hover:text-white transition-all">
              <FaChevronLeft />
            </button>
          )}

          {showRightBtn && reviews.length > 0 && (
            <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white text-blue-900 p-4 rounded-full shadow-xl border border-gray-100 hover:bg-blue-600 hover:text-white transition-all">
              <FaChevronRight />
            </button>
          )}

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-10 pt-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
          >
            {loading ? (
              <p className="w-full text-center text-gray-400">⌛ Loading Magic Stories...</p>
            ) : reviews.length === 0 ? (
              <p className="w-full text-center text-gray-400 italic">No reviews yet. Be the first to share!</p>
            ) : (
              <AnimatePresence>
                {reviews.map((rev) => (
                  <motion.div 
                    key={rev.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-blue-50 p-6 md:p-8 rounded-2xl shadow-sm border border-blue-100 relative w-[280px] md:w-[340px] snap-center shrink-0 flex flex-col whitespace-normal break-words"
                  >
                    <FaQuoteLeft className="text-blue-200 text-3xl absolute top-6 right-6 opacity-40" />
                    
                    <div className="flex text-yellow-400 mb-3 text-sm">
                      {[...Array(parseInt(rev.rating))].map((_, i) => <FaStar key={i} />)}
                    </div>
                    
                    <p className="text-gray-700 italic mb-6 leading-relaxed flex-grow text-sm md:text-base">
                      "{rev.message}"
                    </p>
                    
                    <div className="mt-auto border-t border-blue-200 pt-4">
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">{rev.name}</h4>
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-tighter">{rev.program}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* POPUP FORM */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 w-full max-w-md relative">
              
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl">
                <FaTimes />
              </button>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Write a Review</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" required value={newReview.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your Name" />
                
                <select name="program" value={newReview.program} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="3 Hours Manifestation Webinar">3 Hours Manifestation Webinar</option>
                  <option value="30 Days The Magic Book Practice">30 Days The Magic Book Practice</option>
                  <option value="21 Day Jackpot Course">21 Day Jackpot Course</option>
                  <option value="6 Month Mentorship Program">6 Month Mentorship Program</option>
                </select>
                
                <select name="rating" value={newReview.rating} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                  <option value="3">⭐⭐⭐ (3 Stars)</option>
                </select>
                
                <textarea name="message" required value={newReview.message} onChange={handleChange} rows="4" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="How was your experience?"></textarea>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full font-bold py-3 rounded-lg shadow-md transition-colors text-white ${isSubmitting ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                >
                  {isSubmitting ? 'Posting...' : 'Post Magic Review'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;