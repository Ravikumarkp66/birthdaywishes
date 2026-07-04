import React from 'react';
import { motion } from 'framer-motion';
import InteractiveCanvas from './InteractiveCanvas';

export default function MemoryFrame({ memory, totalCount, index }) {
  // Container variants to stagger sentence fades
  const storyContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1.6, // Delay between each sentence
        delayChildren: 1.2    // Delay before the first sentence starts
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 0.85,
      y: 0,
      transition: {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="relative w-full h-[100vh] flex flex-col justify-end pb-20 px-8 overflow-hidden bg-black select-none">
      
      {/* 1. Cinematic Moving Image Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.img 
          src={memory.image} 
          alt={memory.title}
          animate={{ 
            scale: [1, 1.06, 1.01, 1.06, 1],
            x: [0, 6, -4, 4, 0],
            y: [0, -4, 6, -6, 0]
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="object-cover w-full h-full filter blur-[1px] brightness-[0.7] opacity-80"
        />
        
        {/* Dark Vignette Overlay for Premium Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-obsidian via-black/40 to-black/70 z-10" />
      </div>

      {/* 2. Interactive Layer (twinkles, ripples, sparks) */}
      <InteractiveCanvas type={memory.type} />

      {/* 3. Top Progress Journey Header */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-baseline z-30 pointer-events-none">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.5 }}
          className="text-[10px] font-serif italic text-rose-gold tracking-widest uppercase font-semibold"
        >
          {memory.chapter} / {totalCount}
        </motion.span>
        
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.5 }}
          className="text-[9px] font-sans tracking-[0.3em] text-white uppercase"
        >
          {memory.title}
        </motion.span>
      </div>

      {/* 4. Bottom Story Text Block */}
      <div className="relative z-30 max-w-[340px] w-full flex flex-col space-y-3 text-left">
        
        {/* Date fades in */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.65, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-xs font-serif italic text-rose-gold tracking-wider"
        >
          {memory.date}
        </motion.span>

        {/* Title fades in */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl font-serif text-white tracking-wide leading-tight mt-1"
        >
          {memory.title}
        </motion.h2>

        {/* Sentences fade in line-by-line */}
        <motion.div
          variants={storyContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className="flex flex-col space-y-2.5 mt-3 pr-2"
        >
          {memory.sentences.map((sentence, idx) => (
            <motion.p
              key={idx}
              variants={itemVariants}
              className="text-xs font-sans text-gray-300 leading-relaxed font-light"
            >
              {sentence}
            </motion.p>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
