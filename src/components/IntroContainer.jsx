import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Balloon from './Balloon';
import ConfettiCanvas from './ConfettiCanvas';
import BirthdayMessage from './BirthdayMessage';
import InteractiveCanvas from './InteractiveCanvas';
import IntroTypewriter from './IntroTypewriter';

const getStatusText = (count) => {
  if (count === 22) return "Surprise Unlocked ❤️";
  if (count === 21) return "One Last Balloon 🎈";
  if (count >= 17) return "Almost There...";
  if (count >= 11) return "Halfway There ✨";
  if (count >= 3) return "Keep Going ❤️";
  return "Let's begin...";
};

export default function IntroContainer({ onStartPiano, onDimMusic, onComplete }) {
  // Game states: 'hey-intro' | 'balloon-intro' | 'balloon-game' | 'halfway' | 'unlock' | 'birthday-message'
  const [scene, setScene] = useState('hey-intro');
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [balloonCount, setBalloonCount] = useState(1);
  const [balloonState, setBalloonState] = useState('active'); // 'active' | 'popped'
  const [balloonKey, setBalloonKey] = useState(0); // forces re-render of balloon
  const [burst, setBurst] = useState(null);       // passed to confetti canvas

  const introMessages = [
    "Hey Bangara... ❤️",
    "Martidini ankonda? 🤭",
    "Nan Bangara birthday na...",
    "Nan hege marili helu? ❤️",
    "Ninge ondu chikka surprise ide...",
    "nan bangara hutti 22 years hagide alva so first baloons burst maduuu!",
    "amele matadona!!",
    "Ready aa? ✨",
    "Nodu... ❤️"
  ];

  const handleIntroComplete = () => {
    // Stars become slightly brighter, transition to balloon game after 1s pause
    setTimeout(() => {
      setScene('balloon-game');
    }, 1000);
  };

  // 3. Web Audio Pop Sound Synthesizer
  const playPopSound = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 0.08); // rapidly drop pitch to sound like a pop
      
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn("Pop audio synth error:", e);
    }
  };

  // 4. Pop Interaction Handler
  const handlePop = (x, y, colorConfig) => {
    if (balloonState === 'popped') return; // prevent double taps
    
    // Immediately hide the balloon so the pop feels instant
    setBalloonState('popped');
    
    // Play synthesized pop sound
    playPopSound();

    // Trigger haptic vibration if supported
    if (navigator.vibrate) {
      navigator.vibrate(45);
    }

    const isGold = balloonCount === 22;

    // Trigger confetti burst
    setBurst({ 
      x, 
      y, 
      type: isGold ? 'gold' : 'normal', 
      colors: colorConfig?.colors || ['#FFFFFF'], 
      id: Date.now() 
    });

    if (balloonCount === 11) {
      // Pause for halfway surprise
      setTimeout(() => {
        setScene('halfway');
        setSentenceIndex(0);
      }, 750); // let pop fragments disperse slightly first
    } else if (isGold) {
      setBalloonCount(22);
      // Wait for confetti to fall before unlocking the screen (2.4s)
      setTimeout(() => {
        setScene('unlock');
      }, 2400);
    } else {
      // Spawn next balloon after 250ms for premium overlap animation
      setTimeout(() => {
        setBalloonCount(prev => prev + 1);
        setBalloonState('active');
        setBalloonKey(prev => prev + 1);
      }, 250);
    }
  };

  // 6. Halfway Surprise Sequence
  useEffect(() => {
    if (scene !== 'halfway') return;

    const interval = setTimeout(() => {
      if (sentenceIndex === 0) {
        setSentenceIndex(1);
      } else {
        // Resume game at balloon 12
        setBalloonCount(12);
        setBalloonState('active');
        setBalloonKey(prev => prev + 1);
        setScene('balloon-game');
      }
    }, 2500);

    return () => clearTimeout(interval);
  }, [scene, sentenceIndex]);

  // 7. Unlock Scene Timer
  useEffect(() => {
    if (scene !== 'unlock') return;
    const timer = setTimeout(() => {
      onDimMusic(); // fade volume soft
      setScene('birthday-message');
    }, 4500); // 4.5s allows checkmark to draw + 2.5s pause
    return () => clearTimeout(timer);
  }, [scene, onDimMusic]);

  return (
    <div className="absolute inset-0 bg-[#050506] flex flex-col items-center justify-center overflow-hidden z-50">
      
      {/* Background Twinkling Stars (Fades to 100% brightness during the game) */}
      <InteractiveCanvas 
        type="stars" 
        className={`absolute inset-0 w-full h-full pointer-events-auto z-20 transition-opacity duration-1000 ${
          scene === 'hey-intro' ? 'opacity-65' : 'opacity-100'
        }`}
      />

      {/* Confetti Overlay during game pops and unlock screen */}
      {(scene === 'balloon-game' || scene === 'unlock') && (
        <ConfettiCanvas burst={burst} />
      )}

      {/* Slow golden glowing floating particles during the Unlock Screen */}
      {scene === 'unlock' && (
        <InteractiveCanvas type="beach" />
      )}

      <AnimatePresence mode="wait">
        
        {/* SCENE 1 - INTRO TYPEWRITER */}
        {scene === 'hey-intro' && (
          <IntroTypewriter 
            key="intro-typewriter"
            sentences={introMessages}
            onStartPiano={onStartPiano}
            onComplete={handleIntroComplete}
          />
        )}

        {/* HALFWAY SURPRISE INTERRUPTION */}
        {scene === 'halfway' && (
          <motion.div
            key={`halfway-${sentenceIndex}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.85, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center px-8 z-10"
          >
            <p className="text-xl font-serif italic text-white leading-relaxed tracking-wide">
              {sentenceIndex === 0 ? "Halfway there..." : "The best part is waiting..."}
            </p>
          </motion.div>
        )}

        {/* BALLOON GAME BOARD */}
        {scene === 'balloon-game' && (
          <motion.div
            key="game-board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Premium Top Progress Bar (Visible throughout the game) */}
            <div className="absolute top-10 left-8 right-8 z-30 flex flex-col items-center select-none pointer-events-none max-w-[420px] mx-auto w-[calc(100%-4rem)]">
              {/* Thin progress bar */}
              <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden relative mb-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(balloonCount / 22) * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-rose-gold to-purple-400 shadow-[0_0_8px_rgba(229,193,179,0.5)]"
                />
              </div>
              
              {/* Main tracking labels */}
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-sans mb-1 font-semibold">
                Burst the Balloons
              </span>
              
              {/* Elegant animating counter */}
              <div className="flex items-center justify-center space-x-1.5 text-xs text-rose-gold font-sans font-medium">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={balloonCount}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 0.95 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {balloonCount}
                  </motion.span>
                </AnimatePresence>
                <span className="text-white/30 font-light">of</span>
                <span className="text-white/60">22</span>
              </div>
              
              {/* Dynamic state subtitle */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={getStatusText(balloonCount)}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-[10px] font-serif italic text-rose-gold mt-2 font-medium tracking-wide"
                >
                  {getStatusText(balloonCount)}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Current Active Floating Balloon */}
            {balloonState === 'active' && (
              <Balloon 
                key={balloonKey} 
                number={balloonCount} 
                onPop={handlePop} 
              />
            )}
          </motion.div>
        )}

        {/* UNLOCK SCREEN */}
        {scene === 'unlock' && (
          <motion.div
            key="unlock-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-[#050506]/90 flex flex-col items-center justify-center px-8 z-40 text-center"
          >
            {/* Animated SVG Checkmark Icon */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
              className="w-16 h-16 text-rose-gold mb-6 drop-shadow-[0_0_12px_rgba(229,193,179,0.3)]"
            >
              <motion.circle
                cx="26"
                cy="26"
                r="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
              />
              <motion.path
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
              />
            </motion.svg>

            {/* Surprise Unlocked Text */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl font-serif italic text-white mb-2"
            >
              ✨ Surprise Unlocked ✨
            </motion.h2>

            {/* Descriptive Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ duration: 1.2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-sans text-gray-300 leading-relaxed font-light"
            >
              I've been waiting<br />to show you this...
            </motion.p>
          </motion.div>
        )}

        {/* BIRTHDAY MESSAGE TYPEWRITER */}
        {scene === 'birthday-message' && (
          <BirthdayMessage onComplete={null} onTransition={onComplete} />
        )}

      </AnimatePresence>

    </div>
  );
}
