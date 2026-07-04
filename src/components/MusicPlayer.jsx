import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer({ isMuted, isPlaying, onToggle }) {
  if (!isPlaying) return null; // Only show once music has been initialized by Tap to Begin

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.7, scale: 1 }}
      whileHover={{ opacity: 1, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="fixed top-8 right-8 z-40 p-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md cursor-pointer flex items-center justify-center text-white/80 hover:text-white transition-colors"
      aria-label={isMuted ? "Unmute music" : "Mute music"}
    >
      {isMuted ? (
        <VolumeX size={14} className="text-gray-400" />
      ) : (
        <div className="flex items-end space-x-[2px] h-[14px] w-[14px] px-[1px] justify-center">
          {/* Animated Equalizer Bars */}
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
  );
}
