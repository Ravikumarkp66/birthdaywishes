import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
  { 
    year: "29 May 2022", 
    event: "Where It All Began", 
    desc: "The day we first met. A brief hello that started an unforgettable story." 
  },
  { 
    year: "29 May 2023", 
    event: "One Beautiful Year", 
    desc: "Celebrating one year of friendship, laughter, and shared moments." 
  },
  { 
    year: "29 May 2024", 
    event: "Two Years Together", 
    desc: "Celebrating two years of friendship. Closer, stronger, and always laughing." 
  },
  { 
    year: "29 May 2025", 
    event: "Three Amazing Years", 
    desc: "Celebrating three years of friendship. Navigating life side by side." 
  },
  { 
    year: "29 May 2026", 
    event: "Four Years Together", 
    desc: "Celebrating four years of friendship. Unbreakable bond, endless memories." 
  },
  { 
    year: "5 July 2026", 
    event: "22nd Birthday", 
    desc: "Today is her 22nd birthday.\n\nThis is the beginning of the memory journey." 
  }
];

export default function Timeline() {
  return (
    <section className="relative min-h-[220vh] py-24 px-8 w-full flex flex-col justify-start bg-dark-obsidian overflow-hidden select-none">
      
      {/* Timeline ambient blur lights */}
      <div className="absolute top-[15%] left-1/4 w-48 h-48 rounded-full bg-rose-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-1/4 w-48 h-48 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-20 text-center">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: false, amount: 0.5 }}
          className="text-[9px] uppercase tracking-[0.25em] font-sans text-rose-gold font-bold"
        >
          Our Story
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl font-serif italic text-white mt-2"
        >
          Connecting the Years
        </motion.h2>
      </div>

      {/* Timeline container */}
      <div className="relative max-w-[340px] mx-auto w-full flex-grow">
        
        {/* Grey background timeline line */}
        <div className="absolute left-[9px] top-4 bottom-4 w-[1px] bg-white/10" />

        {/* Illuminated active timeline line */}
        <motion.div 
          initial={{ height: 0 }}
          whileInView={{ height: '98%' }}
          viewport={{ once: false, amount: 0.08 }}
          transition={{ duration: 4.8, ease: "easeInOut" }}
          className="absolute left-[9px] top-4 w-[1px] bg-gradient-to-b from-rose-gold via-purple-400 to-rose-gold shadow-[0_0_8px_rgba(229,193,179,0.5)]"
          style={{ transformOrigin: 'top' }}
        />

        {/* Timeline items */}
        <div className="space-y-24">
          {timelineData.map((item, idx) => (
            <div key={idx} className="relative pl-10 flex flex-col items-start group">
              
              {/* Timeline active glowing circle node */}
              <div className="absolute left-0 top-1.5 w-[19px] h-[19px] flex items-center justify-center -translate-x-[9px]">
                <motion.div 
                  initial={{ scale: 0.8, backgroundColor: "#050506", borderColor: "rgba(255,255,255,0.2)" }}
                  whileInView={{ 
                    scale: 1.18,
                    backgroundColor: "#E5C1B3", 
                    borderColor: "#E5C1B3",
                    boxShadow: "0 0 10px #E5C1B3, 0 0 18px rgba(229,193,179,0.4)" 
                  }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-[9px] h-[9px] border rounded-full z-10"
                />
                
                {/* Secondary node expand ring */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="absolute inset-0 bg-rose-gold/15 rounded-full"
                />
              </div>

              {/* Text content block - Illuminates when in view */}
              <motion.div
                initial={{ opacity: 0.28, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.45 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col space-y-1.5"
              >
                <span className="text-xl font-serif italic text-rose-gold font-semibold tracking-wider">
                  {item.year}
                </span>
                <h3 className="text-xs font-sans tracking-[0.18em] text-white uppercase font-semibold">
                  {item.event}
                </h3>
                <p className="text-[11px] font-sans text-gray-400 leading-relaxed max-w-[280px] whitespace-pre-line" style={{ whiteSpace: 'pre-line' }}>
                  {item.desc}
                </p>
              </motion.div>

            </div>
          ))}
        </div>

      </div>

      {/* Cinematic Transition Footer at the bottom of the timeline */}
      <div className="mt-32 mb-10 text-center flex flex-col items-center justify-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 0.5, y: 0 }}
          viewport={{ once: false, amount: 0.8 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-[9px] uppercase tracking-[0.25em] font-sans text-white/50 mb-1"
        >
          Now...
        </motion.p>
        
        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.8 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg font-serif italic text-rose-gold mb-10"
        >
          Let's relive our memories ❤️
        </motion.h3>
        
        {/* Animated bounce scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-medium"
        >
          <span>↓</span>
        </motion.div>
      </div>

    </section>
  );
}
