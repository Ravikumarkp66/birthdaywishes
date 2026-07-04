import React, { useState, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import { memories } from './data/memories';
import { useAudio } from './hooks/useAudio';
import IntroContainer from './components/IntroContainer';
import Timeline from './components/Timeline';
import MemoryCard from './components/MemoryCard';
import FinalLetter from './components/FinalLetter';
import EndingScene from './components/EndingScene';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'framer-motion';

function App() {
  const [started, setStarted] = useState(false);
  const [letterCompleted, setLetterCompleted] = useState(false);
  const { 
    isPlaying, 
    isMuted, 
    startAudio, 
    crossfadeTo, 
    fadeOutAll, 
    dimVolume,
    toggleMute, 
    playHeartbeat 
  } = useAudio();

  // Scroll to top on refresh/load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBegin = () => {
    setStarted(true);
    // Initialize audio engine (comply with browser autoplay protection)
    startAudio();
  };

  const handleLetterComplete = () => {
    // Fade out all audio before transitioning to the silent ending
    fadeOutAll();
    setLetterCompleted(true);
  };

  const handleActiveSection = (section, index = 0) => {
    if (!started) return;
    
    if (section === 'timeline') {
      crossfadeTo(0); // Track 0: Drone
    } else if (section === 'memory') {
      if (index === 0 || index === 1) {
        crossfadeTo(1); // Track 1: Warm Piano
      } else if (index === 2 || index === 3) {
        crossfadeTo(2); // Track 2: Acoustic Guitar
      }
    } else if (section === 'letter') {
      crossfadeTo(3); // Track 3: Cinematic Strings
    }
  };

  return (
    <div className="min-h-screen bg-dark-obsidian flex items-center justify-center font-sans overflow-x-hidden relative">
      
      {/* Background radial glowing ambient lights on desktop */}
      <div className="hidden md:block absolute top-[15%] left-[20%] w-[350px] h-[350px] bg-purple-950/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Primary Mobile Container (390px responsive column) */}
      <div className="w-full max-w-[390px] min-h-screen bg-[#050506] shadow-2xl relative flex flex-col justify-start overflow-hidden border-x border-white/5">
        
        {/* Floating Sound Controller */}
        <MusicPlayer 
          isPlaying={isPlaying} 
          isMuted={isMuted} 
          onToggle={toggleMute} 
        />

        {/* 1. Intro Screen */}
        {!started && (
          <IntroContainer 
            onStartPiano={() => startAudio(1)} 
            onDimMusic={dimVolume}
            onComplete={handleBegin} 
          />
        )}

        {/* 2. Main Memory Storytelling Scroll */}
        {started && !letterCompleted && (
          <ReactLenis root options={{ lerp: 0.06, duration: 1.6, smoothWheel: true }}>
            <div>
              {/* Timeline Section */}
              <motion.div
                onViewportEnter={() => handleActiveSection('timeline')}
                viewport={{ amount: 0.25 }}
              >
                <Timeline />
              </motion.div>

              {/* Memory Cards */}
              {memories.map((memory, idx) => (
                <MemoryCard 
                  key={memory.id} 
                  {...memory} 
                  onActive={() => handleActiveSection('memory', idx)} 
                />
              ))}

              {/* Spacing void between memories and final letter */}
              <div className="h-[35vh] bg-dark-obsidian relative flex items-center justify-center pointer-events-none">
                <div className="w-[1px] h-24 bg-gradient-to-b from-white/10 to-transparent" />
              </div>

              {/* Envelope and Letter Section */}
              <motion.div
                onViewportEnter={() => handleActiveSection('letter')}
                viewport={{ amount: 0.25 }}
              >
                <FinalLetter onComplete={handleLetterComplete} />
              </motion.div>
            </div>
          </ReactLenis>
        )}

        {/* 3. Ending Heartbeat Scene */}
        {letterCompleted && (
          <EndingScene playHeartbeat={playHeartbeat} />
        )}

      </div>
    </div>
  );
}

export default App;
