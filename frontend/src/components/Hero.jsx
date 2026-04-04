import React from 'react';
import { motion } from 'framer-motion'; // Smooth animation ke liye
import { FaWhatsapp } from 'react-icons/fa'; // Clean WhatsApp icon ke liye

// ==========================================
// HERO COMPONENT: Website ka sabse pehla (Top) section
// ==========================================
const Hero = () => {
  // ------------------------------------------
  // WHATSAPP COMMUNITY LINK
  // ------------------------------------------
  // 👇 Yahan apne WhatsApp Community / Group ka asli invite link dalein
  const communityLink = "https://chat.whatsapp.com/#"; 

  return (
    <section id="home" className="bg-blue-50 py-24 px-6 flex flex-col items-center justify-center text-center min-h-[85vh]">
      
      {/* ------------------------------------------
          MAIN HEADING
          Animation: Upar se halka sa neeche aayega
      ------------------------------------------ */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight"
      >
        Unlock Your <span className="text-blue-600">Full Potential</span> With Us
      </motion.h1>
      
      {/* ------------------------------------------
          SUBTITLE / PARAGRAPH
          Animation: Thodi der baad fade-in hoga
      ------------------------------------------ */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl leading-relaxed"
      >
        Take your Inner potential to the next level with personalized advice and strategic planning. 
        Let my expertise guide you every step of the way.
      </motion.p>

      {/* ------------------------------------------
          WHATSAPP JOIN BUTTON
          Animation: Pop-up effect ke sath aayega
      ------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <a 
          href={communityLink} 
          target="_blank" 
          rel="noreferrer" // Security: Naye tab me kholne par purane tab ko safe rakhta hai
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition hover:-translate-y-1 text-lg flex items-center gap-3"
        >
          <span>Join Our WhatsApp Community</span>
          <FaWhatsapp className="text-2xl" />
        </a>
      </motion.div>

    </section>
  );
};

export default Hero;