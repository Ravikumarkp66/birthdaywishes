import React from 'react';
import { motion } from 'framer-motion';

export default function MemoryCard({ image, id, message, onActive }) {
  // Staggered cinematic animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 20, scale: 1.05 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1.0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const indicatorVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.45,
      transition: {
        duration: 0.6,
        delay: 0.6
      }
    }
  };

  return (
    <motion.section 
      onViewportEnter={onActive}
      viewport={{ amount: 0.25 }}
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      className="w-full min-h-[100vh] flex flex-col justify-center items-center py-20 px-6 max-w-[480px] mx-auto relative select-none bg-dark-obsidian"
    >
      
      {/* 1. Large Photo - rounded, maintain aspect ratio, occupies ~90% width, never crop faces */}
      <motion.div
        variants={imageVariants}
        className="w-[90%] max-w-[410px] aspect-auto max-h-[50vh] rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-white/5 flex items-center justify-center"
      >
        <img 
          src={image} 
          alt={`Memory ${id}`}
          className="w-full h-full object-contain rounded-3xl"
          loading="lazy"
        />
      </motion.div>

      {/* Spacing between image and card */}
      <div className="h-6" />

      {/* 2. Glassmorphic Message Card - below the image */}
      <motion.div
        variants={cardVariants}
        className="w-[90%] max-w-[410px] p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl flex flex-col items-start text-left"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-rose-gold/75 font-semibold block mb-3.5 select-none">
          ✍️ Message
        </span>
        <p 
          className="text-xs font-sans text-gray-200 leading-relaxed font-light whitespace-pre-line"
          style={{ whiteSpace: 'pre-line' }}
        >
          {message}
        </p>
      </motion.div>

      {/* Spacing underneath */}
      <div className="h-10" />

      {/* 3. Scroll Down Indicator - fades in last to encourage continuing */}
      <motion.div
        variants={indicatorVariants}
        className="flex flex-col items-center justify-center space-y-1 select-none pointer-events-none text-white/40 text-[9px] uppercase tracking-[0.3em] font-medium"
      >
        <span>↓</span>
        <span>Scroll Down</span>
        <span>↓</span>
      </motion.div>

    </motion.section>
  );
}
