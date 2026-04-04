import React from 'react';
import { motion } from 'framer-motion'; // Smooth scroll animations ke liye

// ==========================================
// DATA SECTION: Saare Programs ki List
// ==========================================
// Agar future me naya program add karna ho, toh bas is list me ek naya block jod dein
const programsData = [
  {
    title: "3 Hours Manifestation Webinar",
    subtitle: "Understand Fundamentals Of Manifestation",
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
  return (
    <section className="py-20 px-6 bg-gray-50 overflow-hidden" id="programs">
      <div className="max-w-7xl mx-auto">
        
        {/* ------------------------------------------
            SECTION HEADER
            Animation: Upar se neeche aayega
        ------------------------------------------ */}
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

        {/* ------------------------------------------
            PROGRAMS CARDS GRID
        ------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Upar diye gaye Data ko ek-ek karke Card me badalna */}
          {programsData.map((prog, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              // Har card thodi der baad aayega (Staggered Animation effect)
              transition={{ duration: 0.5, delay: index * 0.2 }} 
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden"
            >
              
              {/* IMAGE HEADER */}
              <div className="w-full h-56 overflow-hidden bg-gray-200">
                <img 
                  src={prog.imageUrl} 
                  alt={prog.title} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  loading="lazy" // Website fast load hone ke liye (Lazy loading)
                />
              </div>

              {/* CARD CONTENT */}
              <div className="p-8 flex flex-col flex-grow">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{prog.title}</h4>
                <p className="text-blue-600 font-semibold mb-4">{prog.subtitle}</p>
                <p className="text-gray-600 mb-6 italic leading-relaxed">
                  "{prog.desc}"
                </p>
                
                {/* BULLET POINTS */}
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
                
                {/* ACTION BUTTON */}
                <a 
                  href="#register" 
                  className="mt-auto bg-gray-900 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full text-center inline-block shadow-md hover:shadow-lg"
                >
                  {prog.btnText}
                </a>
              </div>

            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Programs;