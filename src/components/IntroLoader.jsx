import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroLoader({ onBegin }) {
  const [stage, setStage] = useState(0); // 0: dot only, 1: loading memories, 2: ready?, 3: button

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1500); // 1.5s -> show "Loading memories..."
    const t2 = setTimeout(() => setStage(2), 3500); // 3.5s -> show "Ready?"
    const t3 = setTimeout(() => setStage(3), 5500); // 5.5s -> show "Tap to Begin"
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-dark-obsidian flex flex-col items-center justify-center z-50 select-none overflow-hidden">
      <div className="flex flex-col items-center space-y-6">
        
        {/* Stages 0, 1, 2: Pulse Dot */}
        <AnimatePresence mode="wait">
          {stage < 3 ? (
            <motion.div
              key="loader-dot"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: 1,
                boxShadow: ["0 0 4px rgba(255,255,255,0.4)", "0 0 16px rgba(255,255,255,0.8)", "0 0 4px rgba(255,255,255,0.4)"]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                scale: { repeat: Infinity, duration: stage === 2 ? 1 : 2, ease: "easeInOut" },
                boxShadow: { repeat: Infinity, duration: stage === 2 ? 1 : 2, ease: "easeInOut" },
                opacity: { duration: 0.5 }
              }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          ) : (
            <motion.button
              key="begin-button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(229,193,179,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onBegin}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15,
                boxShadow: { duration: 0.3 }
              }}
              className="px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-sans tracking-widest text-rose-gold uppercase shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer hover:border-rose-gold/30 transition-colors"
            >
              Tap to Begin ❤️
            </motion.button>
          )}
        </AnimatePresence>

        {/* Dynamic loading text */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {stage === 1 && (
              <motion.p
                key="loading-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.5, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-xs tracking-widest font-sans uppercase text-gray-400"
              >
                Loading memories...
              </motion.p>
            )}
            {stage === 2 && (
              <motion.p
                key="ready-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.8, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-xs tracking-widest font-sans uppercase text-rose-gold"
              >
                Ready?
              </motion.p>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
