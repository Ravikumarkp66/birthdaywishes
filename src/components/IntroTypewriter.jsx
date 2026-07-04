import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function IntroTypewriter({ sentences, onStartPiano, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [fadeState, setFadeState] = useState("in"); // "in" | "out"

  useEffect(() => {
    // Start background music as the intro begins
    if (currentIndex === 0) {
      onStartPiano();
    }

    const currentSentence = sentences[currentIndex];
    setDisplayedText("");
    setIsTyping(true);
    setShowCursor(true);
    setFadeState("in");

    let charIndex = 0;
    let typingTimer;

    const typeCharacter = () => {
      if (charIndex < currentSentence.length) {
        setDisplayedText(currentSentence.substring(0, charIndex + 1));
        charIndex++;
        typingTimer = setTimeout(typeCharacter, 80); // natural typing speed (80ms)
      } else {
        // Typing finished
        setIsTyping(false);
        
        // Let cursor blink for 800ms after typing, then hide it
        setTimeout(() => {
          setShowCursor(false);
        }, 800);

        // Pause for 2 seconds, then fade out
        setTimeout(() => {
          setFadeState("out");
          // Fade out animation takes 800ms
          setTimeout(() => {
            if (currentIndex < sentences.length - 1) {
              setCurrentIndex(prev => prev + 1);
            } else {
              onComplete();
            }
          }, 800);
        }, 2000);
      }
    };

    // Small delay before starting typing (400ms)
    const startDelay = setTimeout(typeCharacter, 400);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(typingTimer);
    };
  }, [currentIndex, sentences, onStartPiano, onComplete]);

  return (
    <motion.div
      animate={fadeState === "in" ? { opacity: 0.85 } : { opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="text-center px-8 z-10 select-none flex items-center justify-center font-serif text-xl italic text-white tracking-wide"
    >
      <span className="leading-relaxed whitespace-pre-line">{displayedText}</span>
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="inline-block w-[3px] h-[1.1em] bg-rose-gold ml-1 translate-y-[2px]"
        />
      )}
    </motion.div>
  );
}
