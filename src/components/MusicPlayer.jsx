import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicPlayer({ isLowVolume = false, fadeOut = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  // Initialize Audio instance pointing to /public/music/birthday.mp3
  useEffect(() => {
    const audio = new Audio('/music/birthday.mp3');
    audio.loop = true;
    audio.volume = 0; // start at 0 for fade-in
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  // Autoplay Protection Bypass: Start audio on the first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            // Smoothly fade volume from 0 to 0.35 over 2 seconds
            fadeVolume(0.35, 2000);
          })
          .catch(err => console.warn("Autoplay audio blocked:", err));
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return cleanupListeners;
  }, []);

  // Handle prop changes: isLowVolume (dim/restore) and fadeOut (letter completed)
  useEffect(() => {
    if (!isPlaying || isMuted) return;

    if (fadeOut) {
      // Fade out completely over 2s and pause
      fadeVolume(0, 2000, true);
    } else if (isLowVolume) {
      // Dim volume slightly (0.15) over 1s when on letter
      fadeVolume(0.15, 1000);
    } else {
      // Restore volume (0.35) over 1s
      fadeVolume(0.35, 1000);
    }
  }, [isLowVolume, fadeOut, isPlaying, isMuted]);

  // Audio Volume Fade Utility
  const fadeVolume = (targetVolume, durationMs, pauseOnComplete = false) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const startVolume = audio.volume;
    const diff = targetVolume - startVolume;
    if (diff === 0) return;

    const steps = 25;
    const stepTime = durationMs / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const ratio = currentStep / steps;
      const nextVolume = startVolume + diff * ratio;
      audio.volume = Math.max(0, Math.min(1, nextVolume));

      if (currentStep >= steps) {
        clearInterval(fadeIntervalRef.current);
        audio.volume = targetVolume;
        if (pauseOnComplete && targetVolume === 0) {
          audio.pause();
        }
      }
    }, stepTime);
  };

  // Mute / Unmute handler
  const handleToggleMute = (e) => {
    e.stopPropagation();
    const nextMutedState = !isMuted;
    setIsMuted(nextMutedState);

    if (nextMutedState) {
      // Fade to 0 over 500ms
      fadeVolume(0, 500);
    } else {
      // Fade back to active target (0.15 if low volume, else 0.35) over 500ms
      const targetVolume = isLowVolume ? 0.15 : 0.35;
      fadeVolume(targetVolume, 500);
    }
  };

  // Do not render button if music hasn't started yet
  if (!isPlaying) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggleMute}
        className="fixed top-5 right-5 z-40 w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-md cursor-pointer flex items-center justify-center text-white/80 hover:text-white transition-colors shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? (
          <span className="text-sm">🔇</span>
        ) : (
          <div className="flex items-end space-x-[2px] h-[14px] w-[14px] px-[1px] justify-center">
            {/* Premium Animated Equalizer Bars */}
            <motion.div
              animate={{ height: [4, 14, 4] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="w-[2px] bg-rose-gold rounded-full"
            />
            <motion.div
              animate={{ height: [8, 4, 14, 8] }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut", delay: 0.2 }}
              className="w-[2px] bg-rose-gold rounded-full"
            />
            <motion.div
              animate={{ height: [3, 11, 3] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut", delay: 0.4 }}
              className="w-[2px] bg-rose-gold rounded-full"
            />
          </div>
        )}
      </motion.button>
    </AnimatePresence>
  );
}
