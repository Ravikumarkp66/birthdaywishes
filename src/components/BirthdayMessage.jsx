import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PARAGRAPHS = [
  "Happy Birthday Bangaraaaaa nan muddu kandaaaa❤️",
  "There are billions of people\nin this world...",
  "Yet somehow...",
  "life made our paths cross.",
  "And honestly...",
  "I'm grateful\nit happened.",
  "Today isn't just your birthday.",
  "It's the celebration\nof someone\nwho made my life\na little brighter.",
  "So...",
  "instead of simply wishing you,",
  "I want to take you through\nour beautiful journey.",
  "ready na ? bangaraa???  lets gooo❤️."
];

export default function BirthdayMessage({ onComplete, onTransition }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (currentIdx >= PARAGRAPHS.length) {
      setShowButton(true);
      if (onComplete) onComplete();
      return;
    }

    const fullText = PARAGRAPHS[currentIdx];
    setDisplayedText("");

    let charIdx = 0;
    // Typewriter interval
    const interval = setInterval(() => {
      // Safely check bounds
      if (charIdx < fullText.length) {
        setDisplayedText(fullText.substring(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(interval);
        // Pause to let the user read before moving to the next paragraph
        const readTime = fullText.length * 20 + 2000; // responsive pause duration
        setTimeout(() => {
          setCurrentIdx(prev => prev + 1);
        }, readTime);
      }
    }, 55); // 55ms per character typing speed

    return () => clearInterval(interval);
  }, [currentIdx]);

  return (
    <div className="absolute inset-0 bg-dark-obsidian flex flex-col items-center justify-center px-8 text-center select-none z-40">

      {/* Background glow overlay */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[320px] flex flex-col items-center justify-center min-h-[160px] relative">
        <AnimatePresence mode="wait">
          {!showButton && (
            <motion.p
              key={currentIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.9, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-xl font-serif italic text-white leading-relaxed tracking-wide white-space-pre-line"
              style={{ whiteSpace: 'pre-line' }}
            >
              {displayedText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-[2px] h-[18px] bg-rose-gold ml-1 translate-y-[2px]"
              />
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Pulsing glow "Begin Our Journey" button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[20%] flex flex-col items-center"
          >
            <motion.button
              onClick={onTransition}
              animate={{
                boxShadow: [
                  "0 0 15px rgba(229,193,179,0.2)",
                  "0 0 30px rgba(229,193,179,0.5)",
                  "0 0 15px rgba(229,193,179,0.2)"
                ]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 border border-rose-gold/30 bg-rose-gold/10 text-rose-gold rounded-full text-xs font-sans tracking-[0.2em] uppercase font-semibold cursor-pointer shadow-[0_0_20px_rgba(229,193,179,0.1)] transition-colors hover:bg-rose-gold/20"
            >
              Begin Our Journey →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
