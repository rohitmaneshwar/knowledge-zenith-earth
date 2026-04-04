import React from 'react';
import { motion } from 'framer-motion';

// ==========================================
// ABOUT COMPONENT: Omkar ki Story aur Profile
// ==========================================
const About = () => {
  return (
    <section className="py-20 px-6 bg-white overflow-hidden" id="about">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

        {/* ------------------------------------------
            SECTION 1: PHOTO / LOGO AREA (Left Side)
            Animation: Left se ud kar aayega (x: -100)
        ------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }} // Ek hi baar animate hoga
          className="md:w-1/3 flex justify-center"
        >
          {/* Note: Agar aapko 'OM' ki jagah apni asli photo lagani ho, toh is <div> ko hatakar <img> tag laga dein */}
          <div className="w-64 h-64 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-6xl font-bold shadow-lg border-4 border-blue-50">
            OM
          </div>
        </motion.div>

        {/* ------------------------------------------
            SECTION 2: TEXT & STORY AREA (Right Side)
            Animation: Right se ud kar aayega (x: 100)
        ------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }} // Thodi der baad aayega (delay: 0.2)
          viewport={{ once: true }}
          className="md:w-2/3 text-left"
        >
          {/* Headings */}
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">About Me</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">My Story</h3>

          {/* Story Paragraphs */}
          <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
            <p>
              Hello, I’m <strong className="text-gray-900">Omkar Marathe</strong>, the Founder and Coach of "Knowledge Zenith Earth 🌎".
            </p>
            
            <p>
              Over the past 5 years, I’ve had the privilege of coaching over <span className="text-blue-600 font-bold">5688+ individuals</span>, guiding them to transform their lives by tapping into the powerful universal force of the Law of Attraction. My mission is to introduce everyone to this incredible energy and help them create a life filled with abundance, joy, and purpose.
            </p>
            
            <p>
              My journey with the Law of Attraction began in 2016. It was a simple yet life-changing moment when my brother’s friend visited our home and showed me "The Secret" movie on his mobile. I was utterly amazed by the idea that our thoughts could shape our reality. How could it be possible to think of something and see it manifest in your life?
            </p>
            
            <p>
              That moment ignited a spark within me. I dove deep into learning, experimenting, and practicing the principles of manifestation. I read extensively, attended online classes, and applied these teachings in my own life. Over time, I achieved many of my inner desires and goals, turning my dreams into reality.
            </p>
            
            <p>
              But my journey didn’t stop there. Seeing the profound impact this knowledge had on my life, I felt compelled to share it with others. I began helping people understand, practice, and simplify the process of manifestation, making it accessible and effective for everyone.
            </p>
            
            <p>
              Now, it’s my passion and purpose to empower others to unlock their potential and achieve their dreams effortlessly. Come with me, I will show you the step-by-step process that can harness this universal force to create a life filled with endless possibilities. Let’s embark on this transformative journey and make your desires a reality! 🌟
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;