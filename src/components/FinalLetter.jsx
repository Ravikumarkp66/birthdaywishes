import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinalLetter({ onComplete }) {
  const [teaserStage, setTeaserStage] = useState(0); // 0: end, 1: maybe, 2: beginning, 3: envelope
  const [isOpen, setIsOpen] = useState(false);
  const [letterRevealed, setLetterRevealed] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setTeaserStage(1), 1800); // 1.8s -> "Or maybe..."
    const t2 = setTimeout(() => setTeaserStage(2), 3600); // 3.6s -> "the beginning."
    const t3 = setTimeout(() => setTeaserStage(3), 5600); // 5.6s -> show envelope
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    // Delay displaying the full letter till envelope flap rotates open and letter slides out
    setTimeout(() => {
      setLetterRevealed(true);
    }, 1200);
  };

  return (
    <section className="relative min-h-[100vh] w-full flex flex-col items-center justify-center bg-dark-obsidian overflow-hidden select-none px-8 py-16">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-rose-gold/5 blur-3xl pointer-events-none" />

      {/* 1. Teaser Text Sequence */}
      <AnimatePresence>
        {teaserStage < 3 && (
          <div className="absolute flex flex-col items-center justify-center space-y-4 text-center z-10">
            {teaserStage >= 0 && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.6, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 1.2 }}
                className="text-xs uppercase tracking-[0.2em] font-sans text-white font-light"
              >
                You've reached the end.
              </motion.p>
            )}
            {teaserStage >= 1 && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.6, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 1.2 }}
                className="text-xs uppercase tracking-[0.2em] font-sans text-rose-gold font-light"
              >
                ...or maybe
              </motion.p>
            )}
            {teaserStage >= 2 && (
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl font-serif italic text-white"
              >
                the beginning.
              </motion.h2>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* 2. Floating Envelope */}
      <AnimatePresence>
        {teaserStage === 3 && !letterRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center z-20"
          >
            {/* Envelope Interactive Box */}
            <motion.div 
              animate={isOpen ? {} : { y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              onClick={handleOpenEnvelope}
              className="relative w-[280px] h-[180px] bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer overflow-visible perspective-1000"
            >
              
              {/* Inside Letter (slides up on open) */}
              <motion.div 
                animate={isOpen ? { y: -80, scale: 0.9, opacity: 1 } : { y: 0, scale: 0.8, opacity: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
                className="absolute inset-x-4 top-4 bottom-4 bg-[#F5F4F0] rounded-xl flex items-center justify-center shadow-lg border border-black/5"
              >
                <div className="w-10 h-[1px] bg-zinc-400" />
              </motion.div>

              {/* Envelope Body Overlay (Front panels) */}
              <div className="absolute inset-0 bg-[#0E0F14]/40 rounded-2xl pointer-events-none border border-white/5 z-20 overflow-hidden">
                {/* Diagonal lines to make it look like an envelope front */}
                <div className="absolute bottom-0 left-0 w-full h-[90px] bg-[#12141A]/55 clip-path-envelope-bottom" />
              </div>

              {/* Opening Flap */}
              <motion.div 
                style={{ originY: 0 }}
                animate={isOpen ? { rotateX: 180, zIndex: 10 } : { rotateX: 0, zIndex: 30 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full h-[90px] bg-[#181A22] border-b border-white/10 rounded-t-2xl shadow-md clip-path-envelope-flap"
              />

              {/* Helper prompt */}
              {!isOpen && (
                <motion.div 
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute inset-x-0 -bottom-10 text-center pointer-events-none"
                >
                  <span className="text-[10px] uppercase tracking-[0.25em] text-rose-gold/80">Tap to open</span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. The Unfolded Letter */}
      <AnimatePresence>
        {letterRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[340px] letter-gradient text-zinc-800 rounded-3xl p-8 py-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10 z-30 flex flex-col space-y-6 overflow-hidden max-h-[85vh]"
          >
            
            {/* Handwritten script letter */}
            <div className="flex-grow overflow-y-auto no-scrollbar pr-1">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5 }}
                className="font-handwriting text-2xl leading-relaxed text-zinc-800"
              >
                Dear Friend,
                <br /><br />
                I wanted to take a moment to put into words how much our friendship truly means to me.
                <br /><br />
                Looking back at these memories—the coffee cafe laughs, the beach sunsets, stargazing, and walking in the downpour—makes me realize how incredibly lucky I am to have you in my life.
                <br /><br />
                You make the ordinary moments feel cinematic, and the tough days feel manageable. Thank you for always listening, for always laughing at my terrible jokes, and for just being you.
                <br /><br />
                I hope today brings you as much happiness as you bring to everyone around you. You deserve the entire world.
                <br /><br />
                With all my love,
                <br />
                Me
              </motion.p>
            </div>

            {/* Bottom transition trigger */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1 }}
              onClick={onComplete}
              className="w-full py-3 mt-4 border border-zinc-300 text-zinc-700 bg-white/20 hover:bg-white/40 active:bg-white/60 font-sans tracking-widest text-xs uppercase rounded-full cursor-pointer transition-colors text-center font-medium"
            >
              Continue ❤️
            </motion.button>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
