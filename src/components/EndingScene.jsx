import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EndingScene({ playHeartbeat }) {
  const [phase, setPhase] = useState(0); // 0: "One last thing...", 1: "Thank you for existing.", 2: "Happy Birthday", 3: Heartbeat, 4: Black screen
  const [heartScale, setHeartScale] = useState(1);
  const [heartVisible, setHeartVisible] = useState(true);

  // Transition between message phases
  useEffect(() => {
    const t0 = setTimeout(() => setPhase(1), 3000); // 3s: transition to phase 1
    const t1 = setTimeout(() => setPhase(2), 6500); // 6.5s: transition to phase 2
    const t2 = setTimeout(() => setPhase(3), 10000); // 10s: transition to heartbeat phase
    
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Synchronized Heartbeat Loop
  useEffect(() => {
    if (phase !== 3) return;

    let beatCount = 0;
    const maxBeats = 6;
    let timeoutId;

    const runBeat = () => {
      if (beatCount >= maxBeats) {
        setHeartVisible(false);
        // Transition to complete black screen after heart disappears
        setTimeout(() => {
          setPhase(4);
        }, 5000);
        return;
      }

      // Play synthesized audio heartbeat
      playHeartbeat();

      // Visual double-beat (lub-dub)
      // Lub
      setHeartScale(1.3);
      setTimeout(() => {
        setHeartScale(1.05);
      }, 150);

      // Dub
      setTimeout(() => {
        setHeartScale(1.2);
        setTimeout(() => {
          setHeartScale(1);
        }, 180);
      }, 200);

      beatCount++;
      // Setup next beat in 1.5 seconds
      timeoutId = setTimeout(runBeat, 1500);
    };

    // Delay the first beat slightly
    timeoutId = setTimeout(runBeat, 1200);

    return () => clearTimeout(timeoutId);
  }, [phase, playHeartbeat]);

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 select-none overflow-hidden text-center">
      
      <AnimatePresence mode="wait">
        
        {/* Phase 0: One last thing... */}
        {phase === 0 && (
          <motion.h2
            key="last-thing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="font-handwriting text-3xl text-white px-6 font-light"
          >
            One last thing...
          </motion.h2>
        )}

        {/* Phase 1: Thank you for existing. */}
        {phase === 1 && (
          <motion.h2
            key="thank-you"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="font-handwriting text-3xl text-rose-gold px-6 font-light"
          >
            Thank you for existing.
          </motion.h2>
        )}

        {/* Phase 2: Happy Birthday text */}
        {phase === 2 && (
          <motion.div
            key="happy-bday"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="flex flex-col space-y-4 items-center justify-center px-6"
          >
            <h1 className="font-serif italic text-4xl text-white font-medium">
              Happy Birthday.
            </h1>
          </motion.div>
        )}

        {/* Phase 3: The Beating and Fading Heart */}
        {phase === 3 && (
          <motion.div
            key="heartbeat-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="flex flex-col items-center justify-center space-y-12"
          >
            <motion.h1
              animate={heartVisible ? { opacity: 0.9 } : { opacity: 0 }}
              transition={{ duration: 4 }}
              className="font-serif italic text-4xl text-white font-medium"
            >
              Happy Birthday.
            </motion.h1>

            <motion.div
              style={{ scale: heartScale }}
              animate={heartVisible ? { opacity: 0.8 } : { scale: 0, opacity: 0 }}
              transition={heartVisible ? { type: "spring", stiffness: 150, damping: 10 } : { duration: 5, ease: "easeInOut" }}
              className="w-20 h-20 text-rose-gold drop-shadow-[0_0_15px_rgba(229,193,179,0.4)]"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-full h-full"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </motion.div>
          </motion.div>
        )}

        {/* Phase 4: Pitch Black Silence */}
        {phase === 4 && (
          <div key="complete-black" className="w-full h-full bg-black" />
        )}

      </AnimatePresence>

    </div>
  );
}
