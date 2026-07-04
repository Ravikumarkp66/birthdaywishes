import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EndingScene() {
  const playHeartbeat = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      
      // Lub (First low-freq beat)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, now);
      osc1.frequency.exponentialRampToValueAtTime(32, now + 0.15);
      
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.8, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);
      
      // Dub (Second low-freq beat)
      const delay = 0.16;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(50, now + delay);
      osc2.frequency.exponentialRampToValueAtTime(28, now + delay + 0.2);
      
      gain2.gain.setValueAtTime(0, now + delay);
      gain2.gain.linearRampToValueAtTime(0.6, now + delay + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.2);
      
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + delay);
      osc2.stop(now + delay + 0.2);
    } catch (e) {
      console.warn("Heartbeat synthesis error:", e);
    }
  };
  const [phase, setPhase] = useState(0); // 0: Counters, 1: Typist Message, 2: Heartbeat, 3: Complete Black
  const [subPhase, setSubPhase] = useState(0);
  const [heartScale, setHeartScale] = useState(1);
  const [heartVisible, setHeartVisible] = useState(true);

  // Transition between message phases
  useEffect(() => {
    // Stage 0: Counters (runs for 5.2s total)
    const t0 = setTimeout(() => {
      setPhase(1); // Transition to typewriter final messages
      setSubPhase(1);
    }, 5200);

    return () => clearTimeout(t0);
  }, []);

  useEffect(() => {
    if (phase !== 1) return;

    const s1 = setTimeout(() => setSubPhase(2), 1400); // 1.4s -> "Thank you..."
    const s2 = setTimeout(() => setSubPhase(3), 2800); // 2.8s -> "for existing."
    const s3 = setTimeout(() => setSubPhase(4), 4000); // 4.0s -> "❤️"
    
    const t1 = setTimeout(() => {
      setPhase(2); // Transition to heartbeat
    }, 6200);

    return () => {
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(s3);
      clearTimeout(t1);
    };
  }, [phase]);

  // Synchronized Heartbeat Loop
  useEffect(() => {
    if (phase !== 2) return;

    let beatCount = 0;
    const maxBeats = 5;
    let timeoutId;

    const runBeat = () => {
      if (beatCount >= maxBeats) {
        setHeartVisible(false);
        // Transition to complete black screen after heart disappears (3.5s)
        setTimeout(() => {
          setPhase(3);
        }, 3500);
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
    timeoutId = setTimeout(runBeat, 800);

    return () => clearTimeout(timeoutId);
  }, [phase, playHeartbeat]);

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 select-none overflow-hidden text-center">
      
      <AnimatePresence mode="wait">
        
        {/* Phase 0: Friendship Time Counters */}
        {phase === 0 && (
          <motion.div
            key="counters"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col space-y-6 items-center justify-center px-8 text-center max-w-[340px]"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-sans font-semibold">
              We've been friends for
            </span>
            <div className="flex flex-col space-y-3.5 items-start font-sans text-sm text-gray-300 font-light pl-6">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 0.9, x: 0 }} transition={{ delay: 0.5 }} className="flex items-center space-x-3">
                <span className="text-rose-gold text-lg">❤️</span>
                <span className="tracking-wide">4 Years</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 0.9, x: 0 }} transition={{ delay: 0.8 }} className="flex items-center space-x-3">
                <span className="text-lg">📅</span>
                <span className="tracking-wide">1,498 Days</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 0.9, x: 0 }} transition={{ delay: 1.1 }} className="flex items-center space-x-3">
                <span className="text-lg">🕒</span>
                <span className="tracking-wide">35,952 Hours</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 0.9, x: 0 }} transition={{ delay: 1.4 }} className="flex items-center space-x-3">
                <span className="text-lg">✨</span>
                <span className="tracking-wide">Countless Memories</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Phase 1: One last thing typewriter reveal */}
        {phase === 1 && (
          <motion.div
            key="one-last-thing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col space-y-5 items-center justify-center text-center px-6 font-serif italic text-white"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={subPhase >= 1 ? { opacity: 0.5 } : { opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[9px] uppercase tracking-[0.25em] font-sans text-white/50"
            >
              One last thing...
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={subPhase >= 2 ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl font-light tracking-wide"
            >
              Thank you...
            </motion.h2>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={subPhase >= 3 ? { opacity: 0.95, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl font-light tracking-wide"
            >
              for existing.
            </motion.h2>

            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={subPhase >= 4 ? { opacity: 0.95, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="text-2xl text-rose-gold drop-shadow-[0_0_8px_rgba(229,193,179,0.5)]"
            >
              ❤️
            </motion.span>
          </motion.div>
        )}

        {/* Phase 2: Heartbeat visualization in silence */}
        {phase === 2 && (
          <motion.div
            key="heartbeat-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="flex flex-col items-center justify-center"
          >
            <motion.div
              style={{ scale: heartScale }}
              animate={heartVisible ? { opacity: 0.8 } : { scale: 0, opacity: 0 }}
              transition={heartVisible ? { type: "spring", stiffness: 150, damping: 10 } : { duration: 3.5, ease: "easeInOut" }}
              className="w-16 h-16 text-rose-gold drop-shadow-[0_0_12px_rgba(229,193,179,0.35)]"
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

        {/* Phase 3: Complete Black Silence */}
        {phase === 3 && (
          <div key="complete-black" className="w-full h-full bg-black" />
        )}

      </AnimatePresence>

    </div>
  );
}
